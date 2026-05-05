import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Clock, AlertCircle, BarChart3, 
  ArrowUpRight, TrendingUp, Calendar, Briefcase, Layout
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
  const [stats, setStats] = useState({
    global: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 },
    personal: { myTasksCount: 0, myCompletedTasks: 0, myPendingTasks: 0, myOverdueTasks: 0 },
    recentTasks: []
  });
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/dashboard`, config);
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const cards = isAdmin ? [
    { title: 'Total Tasks', value: stats.global.totalTasks, icon: Layout, color: 'bg-primary-500', delay: 0.1 },
    { title: 'Pending Tasks', value: stats.global.pendingTasks, icon: Clock, color: 'bg-amber-500', delay: 0.2 },
    { title: 'Completed', value: stats.global.completedTasks, icon: CheckCircle2, color: 'bg-emerald-500', delay: 0.3 },
    { title: 'Overdue', value: stats.global.overdueTasks, icon: AlertCircle, color: 'bg-rose-500', delay: 0.4 },
  ] : [
    { title: 'Your Tasks', value: stats.personal.myTasksCount, icon: BarChart3, color: 'bg-primary-500', delay: 0.1 },
    { title: 'Your Completed', value: stats.personal.myCompletedTasks, icon: CheckCircle2, color: 'bg-emerald-500', delay: 0.2 },
    { title: 'Project Tasks', value: stats.global.totalTasks, icon: Briefcase, color: 'bg-indigo-500', delay: 0.3 },
    { title: 'Your Overdue', value: stats.personal.myOverdueTasks, icon: AlertCircle, color: 'bg-rose-500', delay: 0.4 },
  ];

  const completionRate = isAdmin 
    ? (stats.global.totalTasks > 0 ? Math.round((stats.global.completedTasks / stats.global.totalTasks) * 100) : 0)
    : (stats.personal.myTasksCount > 0 ? Math.round((stats.personal.myCompletedTasks / stats.personal.myTasksCount) * 100) : 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">{isAdmin ? 'Admin Overview' : 'Dashboard Overview'}</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name}! Here's what's happening across your projects.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-dark-surface border border-dark-border px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-800 transition-colors">
            <Calendar size={16} />
            May 2026
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Task Updates</h2>
          </div>
          
          <div className="space-y-4">
            {(stats.recentTasks || []).length > 0 ? (
              (stats.recentTasks || []).map((task) => (
                <div key={task._id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-all border border-transparent hover:border-dark-border">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'
                  }`}>
                    {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.status} • {task.priority} Priority</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {task.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p>No activity yet. Create a project to get started!</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl h-full">
          <h2 className="text-xl font-bold text-white mb-6">{isAdmin ? 'Organization Progress' : 'Personal Progress'}</h2>
          <div className="space-y-6">
             <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">{isAdmin ? 'Total Completion Rate' : 'Your Completion Rate'}</span>
                  <span className="text-white">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
             </div>
             
             <div className="pt-4 mt-6 border-t border-dark-border">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAdmin 
                    ? "This progress bar reflects the overall completion of all tasks across all projects in the organization."
                    : "This progress bar reflects the ratio of completed tasks specifically assigned to you across all projects."}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
