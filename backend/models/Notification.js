const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['task_assigned', 'member_added', 'task_status_updated'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    relatedTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
