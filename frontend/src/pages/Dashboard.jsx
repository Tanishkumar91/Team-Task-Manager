import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateTaskStatus } from '../store/taskSlice';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, AlertCircle, BarChart3, 
  ArrowUpRight, TrendingUp, Calendar, Briefcase, Layout, User,
  ChevronRight, Folder
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-6 rounded-2xl relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${color}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <span className="flex items-center text-xs font-medium text-emerald-400 gap-1 bg-emerald-400/10 px-2 py-1 rounded-full">
        <TrendingUp size={12} />
        +12%
      </span>
    </div>
    <h3 className="text-slate-400 font-medium text-sm">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    global: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 },
    personal: { myTasksCount: 0, myCompletedTasks: 0, myPendingTasks: 0, myOverdueTasks: 0 },
    recentTasks: [],
    myTasks: []
  });
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [statsRes, projectsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard`, config),
        axios.get(`${API_BASE_URL}/projects`, config)
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    await dispatch(updateTaskStatus({ id, status }));
    fetchData(); // Refresh dashboard data
  };

  const cards = isAdmin ? [
    { title: 'Total Tasks', value: stats.global.totalTasks, icon: Layout, color: 'bg-primary-500', delay: 0.1 },
    { title: 'Pending Tasks', value: stats.global.pendingTasks, icon: Clock, color: 'bg-amber-500', delay: 0.2 },
    { title: 'Completed', value: stats.global.completedTasks, icon: CheckCircle2, color: 'bg-emerald-500', delay: 0.3 },
    { title: 'Overdue', value: stats.global.overdueTasks, icon: AlertCircle, color: 'bg-rose-500', delay: 0.4 },
  ] : [
    { title: 'Your Tasks', value: stats.personal.myTasksCount, icon: BarChart3, color: 'bg-primary-500', delay: 0.1 },
    { title: 'Your Completed', value: stats.personal.myCompletedTasks, icon: CheckCircle2, color: 'bg-emerald-500', delay: 0.2 },
    { title: 'Active Workspaces', value: projects.length, icon: Briefcase, color: 'bg-indigo-500', delay: 0.3 },
    { title: 'Your Overdue', value: stats.personal.myOverdueTasks, icon: AlertCircle, color: 'bg-rose-500', delay: 0.4 },
  ];

  const completionRate = isAdmin 
    ? (stats.global.totalTasks > 0 ? Math.round((stats.global.completedTasks / stats.global.totalTasks) * 100) : 0)
    : (stats.personal.myTasksCount > 0 ? Math.round((stats.personal.myCompletedTasks / stats.personal.myTasksCount) * 100) : 0);

  const displayTasks = isAdmin ? stats.recentTasks : stats.myTasks;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{isAdmin ? 'Admin Overview' : 'Workspace Dashboard'}</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name}! Here's what's on your plate today.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-800/50 border border-white/5 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
            <Calendar size={14} className="text-primary-400" />
            May 2026
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tasks Section */}
          <div className="glass p-6 rounded-[2rem] border border-dark-border">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                {isAdmin ? 'Recent Activity' : 'Your Active Tasks'}
              </h2>
              <Link to="/projects" className="text-xs font-bold text-primary-400 hover:text-primary-300 uppercase tracking-widest">View All</Link>
            </div>
            
            <div className="space-y-3">
              {displayTasks.length > 0 ? (
                displayTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-primary-500/30 transition-all group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'
                    }`}>
                      {task.status === 'Done' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                          <AlertCircle size={10} />
                          {task.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-tighter flex items-center gap-1">
                          <Briefcase size={10} />
                          {task.project?.title || 'No Project'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {!isAdmin && (
                        <select 
                          value={task.status}
                          onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                          className="bg-slate-800 border-none text-xs font-bold text-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary-500 outline-none"
                        >
                          <option value="To-Do">To-Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      )}
                      {isAdmin && (
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {task.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-600 bg-slate-900/20 rounded-2xl border border-dashed border-dark-border">
                  <Layout size={40} className="mb-4 opacity-10" />
                  <p className="text-sm font-medium">No tasks assigned to you yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Workspaces Section for Members */}
          {!isAdmin && (
            <div className="glass p-6 rounded-[2rem] border border-dark-border">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  Active Workspaces
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <Link 
                    key={project._id} 
                    to={`/projects/${project._id}`}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Folder size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{project.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{project.members?.length} Members</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2rem] border border-dark-border relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <BarChart3 size={120} />
            </div>
            <h2 className="text-xl font-bold text-white mb-8">{isAdmin ? 'Team Velocity' : 'Your Efficiency'}</h2>
            <div className="space-y-8">
               <div>
                  <div className="flex justify-between items-end mb-4">
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Completion Rate</p>
                        <h4 className="text-3xl font-black text-white">{completionRate}%</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <TrendingUp size={12} />
                          Good Pace
                        </p>
                     </div>
                  </div>
                  <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      className="bg-gradient-to-r from-primary-600 to-indigo-500 h-full rounded-full shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    ></motion.div>
                  </div>
               </div>
               
               <div className="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    " {isAdmin 
                      ? "Great work! The organization is maintaining a healthy velocity across all active projects."
                      : "You're making steady progress. Keep ticking off those tasks to maintain your streak!"} "
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
