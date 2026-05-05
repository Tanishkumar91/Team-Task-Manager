const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
    try {
        const userProjects = await Project.find({ members: { $in: [req.user._id] } });
        const projectIds = userProjects.map(p => p._id);

        const tasks = await Task.find({ project: { $in: projectIds } });

        const myTasks = tasks.filter(t => t.assignedTo.toString() === req.user._id.toString());

        const stats = {
            // Global Stats (for Admin)
            global: {
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.status === 'Done').length,
                pendingTasks: tasks.filter(t => t.status !== 'Done').length,
                overdueTasks: tasks.filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()).length,
            },
            // Personal Stats (for Member)
            personal: {
                myTasksCount: myTasks.length,
                myCompletedTasks: myTasks.filter(t => t.status === 'Done').length,
                myPendingTasks: myTasks.filter(t => t.status !== 'Done').length,
                myOverdueTasks: myTasks.filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()).length,
            },
            recentTasks: tasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
            myTasks: myTasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
