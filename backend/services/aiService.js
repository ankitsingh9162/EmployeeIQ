const Task = require('../models/Task');
const User = require('../models/User');

/**
 * Advanced AI Service for Productivity Analysis & Recommendations
 */

const calculateScore = (completed, delayed, idleDays) => {
  // Score = Completed Tasks × 10 − Delayed Tasks × 5 − Idle Time × 2
  // We clamp the minimum score to 0 and max to 100 conceptually, but let's allow it to calculate raw first.
  let score = (completed * 10) - (delayed * 5) - (idleDays * 2);
  
  // Normalize score between 0 and 100 for better UI representation
  // If baseline is 100 for perfect... actually, let's keep it percentage based.
  // We'll calculate a percentage relative to a "perfect" score of (total tasks * 10)
  return Math.max(0, score); 
};

exports.generateInsights = async (department = null) => {
  const insights = [];
  const employeesPerf = [];
  
  try {
    let userQuery = { role: 'Employee', isActive: true };
    if (department) userQuery.department = department;

    const users = await User.find(userQuery);
    
    let heavilyLoaded = null;
    let lightestLoaded = null;
    
    for (const user of users) {
      const tasks = await Task.find({ assignedTo: user._id });
      
      const completedTasks = tasks.filter(t => t.status === 'Completed');
      const activeTasks = tasks.filter(t => t.status !== 'Completed');
      const delayedTasks = tasks.filter(t => t.isDelayed);
      
      const daysSinceActive = Math.max(0, (Date.now() - new Date(user.lastActive).getTime()) / (1000 * 3600 * 24));
      
      const rawScore = calculateScore(completedTasks.length, delayedTasks.length, Math.floor(daysSinceActive));
      const totalPossible = tasks.length > 0 ? (tasks.length * 10) : 100;
      let percentScore = tasks.length === 0 ? 0 : Math.round((rawScore / totalPossible) * 100);
      
      // Clamp between 0-100
      percentScore = Math.max(0, Math.min(100, percentScore));

      const loadLevel = activeTasks.length >= 5 ? 'Heavy' : activeTasks.length >= 2 ? 'Medium' : 'Light';

      employeesPerf.push({
        id: user._id,
        name: user.name,
        totalTasks: tasks.length,
        completed: completedTasks.length,
        delayed: delayedTasks.length,
        active: activeTasks.length,
        score: percentScore,
        load: loadLevel,
        idleDays: Math.floor(daysSinceActive)
      });

      // Track extremes for recommendations
      if (!heavilyLoaded || activeTasks.length > heavilyLoaded.active) {
        heavilyLoaded = { name: user.name, active: activeTasks.length };
      }
      if (!lightestLoaded || activeTasks.length < lightestLoaded.active) {
        lightestLoaded = { name: user.name, active: activeTasks.length };
      }
    }

    // Generate Dynamic Insights
    employeesPerf.forEach(emp => {
      if (emp.active >= 5) {
        insights.push({
          type: 'danger',
          message: `${emp.name} is overloaded with ${emp.active} active tasks.`,
          icon: 'AlertTriangle'
        });
      }
      
      if (emp.idleDays > 2 && emp.active === 0) {
        insights.push({
          type: 'warning',
          message: `${emp.name} has been idle for ${emp.idleDays} days with 0 tasks.`,
          icon: 'Clock'
        });
      }

      if (emp.completed >= 3) {
        insights.push({
          type: 'success',
          message: `${emp.name} completed ${emp.completed} tasks recently!`,
          icon: 'CheckCircle'
        });
      }
    });

    // Generate Smart Recommendation
    if (heavilyLoaded && lightestLoaded && heavilyLoaded.name !== lightestLoaded.name && (heavilyLoaded.active - lightestLoaded.active >= 3)) {
      const difference = Math.floor((heavilyLoaded.active - lightestLoaded.active) / 2);
      insights.push({
        type: 'recommendation',
        message: `Recommendation: Move ${difference} tasks from ${heavilyLoaded.name} to ${lightestLoaded.name} to balance workload.`,
        icon: 'Zap'
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        message: 'Team workload is perfectly balanced. No anomalies detected.',
        icon: 'Activity'
      });
    }

    // Sort descending by score
    employeesPerf.sort((a, b) => b.score - a.score);

    return { insights, employeesPerf };
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return { insights: [], employeesPerf: [] };
  }
};
