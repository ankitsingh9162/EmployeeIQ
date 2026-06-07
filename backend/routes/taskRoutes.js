const express = require('express');
const { getTasks, createTask, updateTaskStatus, deleteTask, addComment } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('Admin', 'Manager'), createTask);

router.route('/:id')
  .put(updateTaskStatus)
  .delete(authorize('Admin', 'Manager'), deleteTask);

router.post('/:id/comments', addComment);

module.exports = router;
