import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Zap, 
  MoreHorizontal, 
  Plus,
  Check,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle, trend }) => {
  const navigate = useNavigate();
  return (
    <div className="card p-6 border-b-4 border-primary-500 cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1" onClick={() => navigate('/tasks')}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            +{trend}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
};

const EmployeeDashboard = ({ stats }) => {
  const navigate = useNavigate();
  const productivity = stats?.productivityScore || 78;
  const recentActivity = stats?.recentActivity || [];
  const personalInsights = stats?.personalInsights || [];
  const upcomingDeadlines = stats?.upcomingDeadlines || [];

  const handleTaskClick = (taskId) => {
    navigate(`/tasks?taskId=${taskId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-primary-600">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-xl font-bold">My Performance</h2>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          Last Updated: Just now
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Completed Tasks" 
          value={stats?.completedTasks || 0} 
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500" 
          subtitle="This month"
          trend={12}
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats?.pendingTasks || 0} 
          icon={Clock} 
          colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500" 
          subtitle="Requires attention"
        />
        <StatCard 
          title="Weekly Score" 
          value={`${productivity}%`} 
          icon={TrendingUp} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500" 
          subtitle="Top 15% of team"
          trend={5}
        />
        <StatCard 
          title="Avg Time" 
          value={`${stats?.avgCompletionTime || 2.3} Days`} 
          icon={Clock} 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-500" 
          subtitle="Per task"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Productivity Score */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Productivity Score</h3>
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="relative pt-1">
              <div className="flex mb-4 items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200 dark:bg-primary-900/30 self-start">
                    Task Efficiency
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{productivity}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary-600">
                    Goal: 85%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  style={{ width: `${productivity}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-1000"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You are performing better than <strong>84%</strong> of your peers this week.
            </p>
          </div>

          {/* Active Tasks */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Tasks</h3>
              <button onClick={() => navigate('/tasks')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">View Board</button>
            </div>
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.slice(0, 3).map((task) => (
                  <div 
                    key={task._id} 
                    onClick={() => handleTaskClick(task._id)}
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-primary-500 transition-colors cursor-pointer"
                  >
                    <div className={`w-2 h-10 rounded-full mr-4 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                      <p className="text-xs text-gray-500 capitalize">{task.status} • {task.priority} Priority</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xs font-medium text-gray-400">Deadline</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {format(new Date(task.deadline), 'MMM dd')}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 dark:text-white font-medium">🚀 You're all caught up!</h4>
                  <p className="text-gray-500 text-sm mt-1">Sit tight — your manager will assign tasks soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Insight */}
          <div className="card p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none cursor-pointer hover:shadow-xl transition-shadow" onClick={() => navigate('/tasks')}>
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 mr-2 text-amber-300" />
              <h3 className="text-lg font-bold">AI Smart Insight</h3>
            </div>
            <div className="space-y-4">
              {personalInsights.length > 0 ? personalInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 shrink-0 ${
                    insight.type === 'success' ? 'bg-green-400' : insight.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <p className="text-sm text-white/90">{insight.text}</p>
                </div>
              )) : (
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-white/90 italic">Analyzing your work patterns... check back later!</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity History */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-500" /> Activity History
            </h3>
            <div className="space-y-4">
              {recentActivity.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex space-x-3 items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    item.type === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">{item.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/tasks')} className="w-full mt-6 py-2 text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors uppercase tracking-widest border-t border-gray-100 dark:border-gray-800 pt-4">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
