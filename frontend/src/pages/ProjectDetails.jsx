import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getTasks, createTask, updateTask } from '../store/taskSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Settings, Filter, 
  Clock, CheckCircle2, X, UserPlus 
} from 'lucide-react';

const TaskColumn = ({ title, status, tasks, onAddTask, onUpdateStatus, isAdmin, user }) => (
  <div className="flex-1 min-w-[300px]">
    <div className="flex justify-between items-center mb-4 px-2">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-slate-200">{title}</h3>
        <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      {isAdmin && (
        <button onClick={() => onAddTask(status)} className="text-slate-500 hover:text-primary-400 transition-colors">
          <Plus size={18} />
        </button>
      )}
    </div>

    <div className="space-y-4">
      {tasks.map((task) => (
        <motion.div
          key={task._id}
          layoutId={task._id}
          className="glass p-4 rounded-xl border-l-4 border-l-primary-500 hover:bg-slate-800/40 transition-colors cursor-pointer group shadow-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
              task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {task.priority}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               {(task.assignedTo?._id === user?._id || isAdmin) && (
                 <select 
                   className="bg-slate-800 text-[10px] rounded border-none outline-none text-slate-300 px-1"
                   value={task.status}
                   onChange={(e) => onUpdateStatus(task._id, e.target.value)}
                 >
                   <option value="Todo">Todo</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Done">Done</option>
                 </select>
               )}
            </div>
          </div>
          <h4 className="font-medium text-slate-200 mb-1">{task.title}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
          
          <div className="flex justify-between items-center pt-3 border-t border-dark-border">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
              <Clock size={12} />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-medium">{task.assignedTo?.name}</span>
              <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[8px] font-bold text-white shadow-lg shadow-primary-600/20">
                {task.assignedTo?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', assignedTo: '', dueDate: '' });
  const [memberEmail, setMemberEmail] = useState('');
  
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    };
    fetchProject();
    dispatch(getTasks(id));
  }, [id, dispatch, user]);

  const onUpdateStatus = (taskId, newStatus) => {
    dispatch(updateTask({ id: taskId, taskData: { status: newStatus } }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    dispatch(createTask({ ...taskForm, projectId: id }));
    setIsTaskModalOpen(false);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_BASE_URL}/projects/${id}/add-member`, { email: memberEmail }, config);
      const { data } = await axios.get(`${API_BASE_URL}/projects/${id}`, config);
      setProject(data);
      setIsMemberModalOpen(false);
      setMemberEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  if (!project) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Clock className="animate-spin text-primary-500" size={40} />
      <p className="text-slate-400 animate-pulse">Loading project details...</p>
    </div>
  );

  const projectOwnerId = project.createdBy?._id || project.createdBy;
  const isAdmin = user.role === 'Admin' || projectOwnerId === user._id;

  return (
    <div className="max-w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30 shrink-0">
             <CheckCircle2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
           <div className="flex -space-x-2 mr-4">
              {project.members?.map((m, i) => (
                <div key={i} title={m.name} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-dark-bg flex items-center justify-center text-[10px] font-bold text-slate-300">
                  {m.name?.charAt(0)}
                </div>
              ))}
              {isAdmin && (
                <button 
                  onClick={() => setIsMemberModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-primary-600/20 border-2 border-dark-bg flex items-center justify-center text-primary-400 hover:bg-primary-600/40 transition-all"
                >
                  <Plus size={14} />
                </button>
              )}
           </div>
           <button className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"><Settings size={20} /></button>
           <button className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"><Filter size={20} /></button>
           <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={() => setIsTaskModalOpen(true)}>
             <Plus size={20} /> New Task
           </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        <TaskColumn 
          title="To Do" 
          status="Todo" 
          tasks={(tasks || []).filter(t => t.status === 'Todo')} 
          isAdmin={isAdmin}
          user={user}
          onAddTask={(s) => { setTaskForm({...taskForm, status: s}); setIsTaskModalOpen(true); }}
          onUpdateStatus={onUpdateStatus}
        />
        <TaskColumn 
          title="In Progress" 
          status="In Progress" 
          tasks={(tasks || []).filter(t => t.status === 'In Progress')} 
          isAdmin={isAdmin}
          user={user}
          onAddTask={(s) => { setTaskForm({...taskForm, status: s}); setIsTaskModalOpen(true); }}
          onUpdateStatus={onUpdateStatus}
        />
        <TaskColumn 
          title="Done" 
          status="Done" 
          tasks={(tasks || []).filter(t => t.status === 'Done')} 
          isAdmin={isAdmin}
          user={user}
          onAddTask={(s) => { setTaskForm({...taskForm, status: s}); setIsTaskModalOpen(true); }}
          onUpdateStatus={onUpdateStatus}
        />
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTaskModalOpen(false)}></div>
             <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="glass w-full max-w-lg rounded-2xl relative z-10 overflow-hidden">
                <div className="p-6 border-b border-dark-border flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Create New Task</h2>
                  <button onClick={() => setIsTaskModalOpen(false)}><X size={20} /></button>
                </div>
                <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400">Title</label>
                      <input type="text" className="input-field w-full" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400">Description</label>
                      <textarea className="input-field w-full" rows="3" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-400">Priority</label>
                         <select className="input-field w-full bg-dark-bg" value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-400">Due Date</label>
                         <input type="date" className="input-field w-full" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400">Assign To</label>
                      <select className="input-field w-full bg-dark-bg" required value={taskForm.assignedTo} onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})}>
                         <option value="">Select Member</option>
                         {project.members?.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                      </select>
                   </div>
                   <button type="submit" className="btn-primary w-full py-3 mt-4">Create Task</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Modal */}
      <AnimatePresence>
        {isMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMemberModalOpen(false)}></div>
             <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="glass w-full max-w-md rounded-2xl relative z-10 overflow-hidden">
                <div className="p-6 border-b border-dark-border flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Add Team Member</h2>
                  <button onClick={() => setIsMemberModalOpen(false)}><X size={20} /></button>
                </div>
                <form onSubmit={handleAddMember} className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400">User Email</label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-3 text-slate-500" size={18} />
                        <input type="email" className="input-field w-full pl-10" placeholder="colleague@company.com" required value={memberEmail} onChange={e => setMemberEmail(e.target.value)} />
                      </div>
                   </div>
                   <button type="submit" className="btn-primary w-full py-3 mt-2">Add to Project</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
