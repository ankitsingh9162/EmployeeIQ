const Task = require('../models/Task');

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query = {};

    // Employee can only see their assigned tasks
    if (req.user.role === 'Employee') {
      query.assignedTo = req.user._id;
    }
    
    // Manager/Admin can filter by assignee
    if (req.query.assignedTo && req.user.role !== 'Employee') {
      query.assignedTo = req.query.assignedTo;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .sort('order -createdAt');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Manager/Admin)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority, tags, status } = req.body;

    // Get highest order for the column
    const lastTask = await Task.findOne({ status: status || 'To Do' }).sort('-order');
    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      deadline,
      priority,
      tags: tags || [],
      status: status || 'To Do',
      order: newOrder
    });

    // Notify via Socket.io
    if (req.io) {
      req.io.to(assignedTo.toString()).emit('newTask', task);
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, completionTime, order, tags } = req.body;
    
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization: Employee can only update their own tasks
    if (req.user.role === 'Employee' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (status !== undefined) {
      task.status = status;
      task.history.push({ status });
    }

    if (order !== undefined) task.order = order;
    if (tags !== undefined) task.tags = tags;

    if (status === 'Completed' && completionTime) {
      task.completionTime = completionTime;
    }

    await task.save();

    // Populate for response
    task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    // Notify via Socket.io
    if (req.io) {
      req.io.to(task.assignedBy._id.toString()).emit('taskUpdated', task);
      req.io.emit('dashboardUpdate'); // Broadcast to all for dashboard updates
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Manager/Admin)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    if (req.io) {
      req.io.emit('dashboardUpdate');
    }

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      text,
      user: req.user._id
    });

    await task.save();

    task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    if (req.io) {
      req.io.emit('taskUpdated', task);
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
