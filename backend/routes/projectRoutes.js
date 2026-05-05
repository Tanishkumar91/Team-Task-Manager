const express = require('express');
const router = express.Router();
const { 
    createProject, getProjects, getProjectById, updateProject, deleteProject, addMember 
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, getProjects)
    .post(protect, admin, createProject);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, admin, updateProject)
    .delete(protect, admin, deleteProject);

router.post('/:id/add-member', protect, admin, addMember);

module.exports = router;
