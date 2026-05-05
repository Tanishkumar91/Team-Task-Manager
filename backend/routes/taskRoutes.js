const express = require('express');
const router = express.Router();
const { 
    createTask, getTasksByProject, updateTask, deleteTask 
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, getTasksByProject)
    .post(protect, admin, createTask);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, admin, deleteTask);

module.exports = router;
