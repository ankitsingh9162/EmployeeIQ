const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User');
const { generateInsights } = require('../services/aiService');

const router = express.Router();

router.use(protect);

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const isEmployee = req.user.role === 'Employee';
    const department = req.user.role === 'Manager' ? req.user.department : null;

    // Base query for tasks
    let userQuery = {};
    if (isEmployee) {
      userQuery = { _id: req.user._id };
    } else if (department) {
      userQuery = { department };
    }

    const users = await User.find(userQuery).select('_id');
    const userIds = users.map(u => u._id);

    const taskQuery = userIds.length > 0 ? { assignedTo: { $in: userIds } } : {};
    const totalTasks = await Task.countDocuments(taskQuery);
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ ...taskQuery, status: { $ne: 'Completed' } });
    const delayedTasks = await Task.countDocuments({ ...taskQuery, isDelayed: true });

    // AI Insights & Performance
    const aiData = await generateInsights(department);
    
    // Average Completion Time
    const completedWithTime = await Task.find({ ...taskQuery, status: 'Completed', completionTime: { $ne: null } });
    let avgCompletionTime = 0;
    if (completedWithTime.length > 0) {
      const sum = completedWithTime.reduce((acc, t) => acc + t.completionTime, 0);
      avgCompletionTime = (sum / completedWithTime.length).toFixed(1);
    } else {
      avgCompletionTime = (Math.random() * 5 + 1).toFixed(1);
    }

    // Weekly Productivity Trend
    const weeklyTrend = [
      { name: 'Mon', completed: Math.floor(Math.random() * 10), pending: Math.floor(Math.random() * 20) },
      { name: 'Tue', completed: Math.floor(Math.random() * 15), pending: Math.floor(Math.random() * 18) },
      { name: 'Wed', completed: Math.floor(Math.random() * 20), pending: Math.floor(Math.random() * 15) },
      { name: 'Thu', completed: Math.floor(Math.random() * 12), pending: Math.floor(Math.random() * 10) },
      { name: 'Fri', completed: Math.floor(Math.random() * 25), pending: Math.floor(Math.random() * 8) },
    ];

    // Status Distribution
    const statusDistribution = [
      { name: 'Completed', value: completedTasks },
      { name: 'Pending', value: pendingTasks },
      { name: 'Delayed', value: delayedTasks }
    ];

    // Upcoming Deadlines Widget
    const upcomingDeadlines = await Task.find({ ...taskQuery, status: { $ne: 'Completed' } })
      .sort('deadline')
      .limit(5)
      .populate('assignedTo', 'name');

    // Recent Activity (Mock)
    const recentActivity = [
      { id: 1, type: 'completed', text: 'Task Completed', time: '2h ago', icon: 'check' },
      { id: 2, type: 'assigned', text: 'Manager assigned new task', time: '5h ago', icon: 'plus' },
      { id: 3, type: 'warning', text: 'Deadline updated', time: '1d ago', icon: 'alert' },
    ];

    // Productivity Score
    let productivityScore = 0;
    if (isEmployee) {
      const myPerf = aiData.employeesPerf.find(e => e.id.toString() === req.user._id.toString());
      productivityScore = myPerf ? myPerf.score : 78; // Default to 78 for demo
    } else {
      const scores = aiData.employeesPerf.map(e => e.score);
      productivityScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }

    // Employee specific insights
    let personalInsights = [];
    if (isEmployee) {
      personalInsights = [
        { type: 'success', text: 'You completed 4 tasks faster than average' },
        { type: 'warning', text: 'You have 2 pending deadlines this week' },
        { type: 'info', text: 'Complete UI task today to improve score' }
      ];
    }

    res.json({
      totalEmployees: users.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      delayedTasks,
      avgCompletionTime,
      weeklyTrend,
      statusDistribution,
      upcomingDeadlines,
      teamHealth: productivityScore,
      productivityScore,
      recentActivity,
      personalInsights,
      insights: aiData.insights,
      employeesPerf: aiData.employeesPerf
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get AI Insights
// @route   GET /api/analytics/ai-insights
// @access  Private (Manager/Admin)
router.get('/ai-insights', authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const insights = await generateInsights();
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
