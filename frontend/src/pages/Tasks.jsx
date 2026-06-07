import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Clock, MessageSquare, AlertCircle, X, CheckSquare, Search, Filter } from 'lucide-react';
import io from 'socket.io-client';

const COLUMNS = ['To Do', 'In Progress', 'In Review', 'Completed'];

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'Medium' });

  useEffect(() => {
    // Check for taskId in URL to open modal automatically
    if (tasks.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const taskId = params.get('taskId');
      if (taskId) {
        const task = tasks.find(t => t._id === taskId);
        if (task) setSelectedTask(task);
      }
    }
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
    if (user?.role !== 'Employee') fetchUsers();

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.emit('join', user?._id);

    socket.on('newTask', (task) => {
      setTasks(prev => [...prev, task]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      setSelectedTask(prev => prev?._id === updatedTask._id ? updatedTask : prev);
    });

    return () => socket.disconnect();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', newTask);
      setTasks([...tasks, res.data]);
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', deadline: '', priority: 'Medium' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Find task
    const task = tasks.find(t => t._id === draggableId);
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedTasks = Array.from(tasks);
    const draggedTaskIndex = updatedTasks.findIndex(t => t._id === draggableId);
    updatedTasks[draggedTaskIndex] = { ...task, status: newStatus };
    setTasks(updatedTasks);

    try {
      // In a real production app, we would calculate exact order between adjacent items.
      // For now, simply updating status is the most critical part.
      await api.put(`/tasks/${draggableId}`, { status: newStatus, order: destination.index });
    } catch (err) {
      console.error(err);
      fetchTasks(); // revert on fail
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTask) return;
    try {
      const res = await api.post(`/tasks/${selectedTask._id}/comments`, { text: commentText });
      setSelectedTask(res.data);
      setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Group tasks by column
  const columnsData = COLUMNS.reduce((acc, col) => {
    acc[col] = tasks.filter(t => t.status === col).sort((a, b) => a.order - b.order);
    return acc;
  }, {});

  const PriorityIcon = ({ priority }) => {
    if (priority === 'High') return <div className="w-4 h-4 bg-red-100 flex items-center justify-center rounded text-red-600 text-xs font-bold" title="High">↑</div>;
    if (priority === 'Medium') return <div className="w-4 h-4 bg-yellow-100 flex items-center justify-center rounded text-yellow-600 text-xs font-bold" title="Medium">=</div>;
    return <div className="w-4 h-4 bg-blue-100 flex items-center justify-center rounded text-blue-600 text-xs font-bold" title="Low">↓</div>;
  };

  return (
    <div className="flex flex-col h-full -m-6 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center">
            <CheckSquare className="w-4 h-4 mr-1 text-primary-600" />
            Projects / EmployeeIQ / Board
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sprints</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search issues..." className="input-field pl-9 py-1.5 text-sm w-48" />
          </div>
          <button className="btn btn-outline py-1.5 px-3 flex items-center text-sm">
            <Filter className="w-4 h-4 mr-1" /> Filters
          </button>
          {(user?.role === 'Manager' || user?.role === 'Admin') && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary py-1.5 px-4 text-sm shadow-sm">
              Create Issue
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-4 h-full items-start min-w-max">
            {COLUMNS.map(columnId => (
              <div key={columnId} className="w-80 flex flex-col max-h-full bg-gray-50/50 dark:bg-dark-bg/50 rounded-lg">
                <div className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider flex justify-between items-center sticky top-0">
                  {columnId} 
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {columnsData[columnId].length}
                  </span>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-2 space-y-3 overflow-y-auto min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {columnsData[columnId].map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={`bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border cursor-pointer hover:border-primary-400 dark:hover:border-primary-600 transition-colors ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500/50 rotate-2' : ''
                              }`}
                            >
                              <div className="flex flex-wrap gap-1 mb-2">
                                {task.tags?.map(tag => (
                                  <span key={tag} className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-sm">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="text-sm text-gray-900 dark:text-white font-medium leading-snug mb-3">
                                {task.title}
                              </p>
                              
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{task.issueKey}</span>
                                  {task.comments?.length > 0 && (
                                    <span className="flex items-center text-xs text-gray-400">
                                      <MessageSquare className="w-3 h-3 mr-1" /> {task.comments.length}
                                    </span>
                                  )}
                                  {task.isDelayed && <AlertCircle className="w-3 h-3 text-red-500" />}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <PriorityIcon priority={task.priority} />
                                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-dark-card" title={task.assignedTo?.name}>
                                    {task.assignedTo?.name ? task.assignedTo.name.charAt(0) : '?'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Details Modal (Jira Style) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white dark:bg-dark-card h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                <CheckSquare className="w-5 h-5 mr-2 text-primary-600" />
                {selectedTask.issueKey}
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row h-full">
                {/* Main Content */}
                <div className="flex-1 p-6 md:border-r border-gray-200 dark:border-dark-border">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{selectedTask.title}</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedTask.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Activity</h3>
                    <div className="space-y-4 mb-6">
                      {selectedTask.comments?.map((c, i) => (
                        <div key={i} className="flex space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-700 text-xs">
                            {c.user?.name ? c.user.name.charAt(0) : '?'}
                          </div>
                          <div>
                            <div className="flex items-baseline space-x-2">
                              <span className="font-semibold text-sm text-gray-900 dark:text-white">{c.user?.name}</span>
                              <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <form onSubmit={handleAddComment} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center font-bold text-primary-700 text-xs">
                        {user?.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <textarea 
                          className="input-field min-h-[80px] text-sm" 
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                        />
                        <div className="mt-2 flex justify-end">
                          <button type="submit" className="btn btn-primary py-1.5 px-4 text-sm" disabled={!commentText.trim()}>Save</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="w-full md:w-64 p-6 bg-gray-50/50 dark:bg-dark-bg/20 space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                    <select 
                      className="input-field mt-1 text-sm bg-gray-100 dark:bg-gray-800 border-none font-semibold text-gray-700 dark:text-gray-200"
                      value={selectedTask.status}
                      onChange={(e) => handleDragEnd({ destination: { droppableId: e.target.value }, source: {}, draggableId: selectedTask._id })}
                    >
                      {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Assignee</label>
                    <div className="flex items-center mt-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-2">
                        {selectedTask.assignedTo?.name ? selectedTask.assignedTo.name.charAt(0) : '?'}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedTask.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Reporter</label>
                    <div className="flex items-center mt-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold mr-2">
                        {selectedTask.assignedBy?.name ? selectedTask.assignedBy.name.charAt(0) : '?'}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedTask.assignedBy?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                    <div className="flex items-center mt-2 space-x-2">
                      <PriorityIcon priority={selectedTask.priority} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{selectedTask.priority}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Dates</label>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>Created: {new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                      <p className={selectedTask.isDelayed ? 'text-red-500 font-medium' : ''}>
                        Due: {new Date(selectedTask.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Create Modal (Kept Simple for Demo) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
              <Plus className="w-5 h-5 mr-2" /> Create Issue
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Summary</label>
                <input required type="text" className="input-field text-sm py-2" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                <textarea required className="input-field text-sm min-h-[100px]" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Assignee</label>
                  <select required className="input-field text-sm" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                    <option value="">Select...</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Priority</label>
                  <select className="input-field text-sm" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Due Date</label>
                <input required type="date" className="input-field text-sm" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">Cancel</button>
                <button type="submit" className="btn btn-primary text-sm shadow-sm">Create Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
