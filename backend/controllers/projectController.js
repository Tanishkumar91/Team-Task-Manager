const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
    const { title, description } = req.body;
    try {
        const project = await Project.create({
            title,
            description,
            createdBy: req.user._id,
            members: [req.user._id]
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: { $in: [req.user._id] }
        })
        .populate('createdBy', 'name email')
        .populate('members', 'name email')
        .lean();

        const projectsWithTaskCounts = await Promise.all(projects.map(async (project) => {
            const taskCount = await Task.countDocuments({ 
                project: project._id, 
                assignedTo: req.user._id,
                status: { $ne: 'Done' }
            });
            return { ...project, myActiveTasksCount: taskCount };
        }));

        res.json(projectsWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('members', 'name email')
            .populate('createdBy', 'name email');
        
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can update project' });
        }

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only owner can delete project' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMember = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const project = await Project.findById(req.params.id);
        
        const isAlreadyMember = project.members.some(m => m.toString() === user._id.toString());
        
        if (!isAlreadyMember) {
            project.members.push(user._id);
            await project.save();

            await Notification.create({
                recipient: user._id,
                sender: req.user._id,
                message: `You have been added to project: ${project.title}`,
                type: 'member_added',
                relatedProject: project._id
            });
        }
        
        const updatedProject = await Project.findById(req.params.id).populate('members', 'name email');
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
