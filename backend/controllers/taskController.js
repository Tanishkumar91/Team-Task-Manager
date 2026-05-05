const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.createTask = async (req, res) => {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const task = await Task.create({
            title, description, project: projectId, assignedTo, priority, dueDate
        });

        // Notify Assignee
        if (assignedTo.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: assignedTo,
                sender: req.user._id,
                message: `New Task: ${title} assigned to you.`,
                type: 'task_assigned',
                relatedProject: projectId,
                relatedTask: task._id
            });
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.query.projectId })
            .populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const isAssignee = task.assignedTo.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'Admin';

        if (!isAssignee && !isAdmin) {
            return res.status(403).json({ message: 'You can only update tasks assigned to you' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('assignedTo', 'name email');

        // Notify Admin if status changed by a member
        if (req.body.status && req.user.role !== 'Admin') {
            await Notification.create({
                recipient: task.project.createdBy,
                sender: req.user._id,
                message: `${req.user.name} marked task "${task.title}" as ${req.body.status} in ${task.project.title}`,
                type: 'task_status_updated',
                relatedProject: task.project._id,
                relatedTask: task._id
            });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
