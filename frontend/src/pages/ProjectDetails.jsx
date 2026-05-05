import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import API_BASE_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, Users, Clock, 
  CheckCircle2, AlertCircle, Filter, 
  Search, MoreVertical, UserPlus, 
  Layout, Briefcase, ChevronRight, X
} from 'lucide-react';
import { createTask, getTasks, updateTaskStatus } from '../store/taskSlice';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  
  const [project, setProject] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/projects/${id}`, config);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project', error);
      }
    };

    if (user) {
      fetchProjectDetails();
      dispatch(getTasks());
    }
  }, [id, user, dispatch]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    dispatch(createTask({ ...newTask, project: id }));
    setIsTaskModalOpen(false);
    setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '' });
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
    } catch (error) {
      console.error('Error adding member', error);
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  const projectTasks = tasks.filter(task => task.project === id || task.project?._id === id);

  if (!project) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
            <Link to="/projects" className="hover:text-primary-400 transition-colors">Projects</Link>
            <ChevronRight size={14} />
            <span className="text-slate-300 font-medium">{project.name}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            {project.name}
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
              project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {project.status}
            </span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMemberModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all font-medium border border-white/5"
          >
            <UserPlus size={18} />
            Invite
          </button>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Tasks */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-6">
                <button className="text-sm font-bold text-white border-b-2 border-primary-500 pb-2">All Tasks</button>
                <button className="text-sm font-medium text-slate-500 hover:text-slate-300 pb-2">Milestones</button>
                <button className="text-sm font-medium text-slate-500 hover:text-slate-300 pb-2">Files</button>
             </div>
             <div className="flex items-center gap-2">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                   <input type="text" placeholder="Search tasks..." className="bg-slate-900/50 border border-dark-border rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/50" />
                </div>
                <button className="p-2 bg-slate-900/50 border border-dark-border rounded-lg text-slate-500"><Filter size={14} /></button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTasks.map(task => (
              <motion.div 
                layout
                key={task._id}
                className="glass p-5 rounded-2xl border border-dark-border hover:border-primary-500/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {task.priority}
                  </span>
                  <button className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                </div>
                <h4 className="text-white font-bold mb-2 group-hover:text-primary-400 transition-colors">{task.title}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6">{task.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-dark-bg">
                        {task.assignedTo?.name?.charAt(0) || 'U'}
                     </div>
                     <span className="text-xs text-slate-400">{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${task.status === 'Done' ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <select 
                      value={task.status}
                      onChange={(e) => dispatch(updateTaskStatus({ id: task._id, status: e.target.value }))}
                      className="bg-transparent focus:outline-none cursor-pointer hover:text-white transition-colors"
                    >
                      <option value="To-Do">To-Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
            {projectTasks.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-2xl border-dashed border-2 border-dark-border">
                <Layout className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500">No tasks in this project yet.</p>
                <button onClick={() => setIsTaskModalOpen(true)} className="text-primary-400 font-bold mt-2 hover:text-primary-300">Create the first one</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info & Team */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-dark-border">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <AlertCircle size={18} className="text-primary-500" />
              Project Health
            </h3>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">Task Completion</span>
                    <span className="text-white">64%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full w-[64%] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]"></div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Due Date</p>
                    <p className="text-xs text-white font-medium">May 28, 2026</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Team Size</p>
                    <p className="text-xs text-white font-medium">{project.members?.length || 0} Members</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-dark-border">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Users size={18} className="text-emerald-500" />
                  Team Members
                </h3>
                <button onClick={() => setIsMemberModalOpen(true)} className="p-1.5 bg-primary-600/10 text-primary-400 rounded-lg hover:bg-primary-600/20"><Plus size={14} /></button>
             </div>
             <div className="space-y-4">
                {project.members?.map(member => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-slate-300 text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{member.role}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Modals - Simplified implementation */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-dark-surface border border-dark-border w-full max-w-md p-8 rounded-[2rem] shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input type="text" placeholder="Task Title" className="input-field w-full" required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                <textarea placeholder="Description" className="input-field w-full h-24 resize-none" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="input-field w-full" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <input type="date" className="input-field w-full" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-3 rounded-xl">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isMemberModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMemberModalOpen(false)} className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-dark-surface border border-dark-border w-full max-w-md p-8 rounded-[2rem] shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Invite Member</h2>
              <p className="text-slate-400 text-sm mb-6">Add a team member to this project by their email address.</p>
              <form onSubmit={handleAddMember} className="space-y-4">
                <input type="email" placeholder="colleague@company.com" className="input-field w-full" required value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsMemberModalOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-3 rounded-xl">Send Invite</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
