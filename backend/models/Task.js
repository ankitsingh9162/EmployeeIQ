const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    issueKey: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'In Review', 'Completed'],
      default: 'To Do',
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [String],
    comments: [
      {
        text: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    completionTime: {
      type: Number, // in hours
      default: null,
    },
    isDelayed: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to check for delays and generate issueKey
taskSchema.pre('save', async function () {
  // Generate issueKey if it doesn't exist
  if (!this.issueKey) {
    try {
      // Very simple incrementer for VOLT-1, VOLT-2, etc.
      // In production, use a separate counter collection.
      const lastTask = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
      let nextId = 1;
      if (lastTask && lastTask.issueKey && lastTask.issueKey.startsWith('VOLT-')) {
        const lastId = parseInt(lastTask.issueKey.replace('VOLT-', ''), 10);
        if (!isNaN(lastId)) nextId = lastId + 1;
      } else {
        // Fallback fallback
        nextId = Math.floor(Math.random() * 10000);
      }
      this.issueKey = `VOLT-${nextId}`;
    } catch (err) {
      this.issueKey = `VOLT-${Math.floor(Math.random() * 10000)}`;
    }
  }

  if (this.status !== 'Completed' && this.deadline && new Date() > this.deadline) {
    this.isDelayed = true;
  }
});

module.exports = mongoose.model('Task', taskSchema);
