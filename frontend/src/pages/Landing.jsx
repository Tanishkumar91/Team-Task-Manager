import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Layout, Users, 
  Zap, Shield, CheckCircle2 
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/20">
              <span className="text-white font-black text-sm">W</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Workspace</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="btn-primary text-xs py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Ultra Minimal */}
      <section className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Manage projects. <br /> 
              Sync your team.
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto">
              A simple, powerful workspace for modern teams. Organize tasks, 
              track progress, and collaborate in real-time.
            </p>
            <div className="flex justify-center">
              <Link to="/signup" className="btn-primary px-8 py-4 text-lg flex items-center gap-2 group">
                Get started with Workspace
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Simple & Direct */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="text-primary-500"><Layout size={32} /></div>
              <h3 className="text-xl font-bold text-white">Project Board</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize your workflow with a clean Kanban board. Move tasks from To-Do to Done with ease.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-emerald-500"><Users size={32} /></div>
              <h3 className="text-xl font-bold text-white">Team Directory</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Manage your team members, assign roles, and see who is working on what across all projects.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-amber-500"><Zap size={32} /></div>
              <h3 className="text-xl font-bold text-white">Live Alerts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stay updated with real-time notifications for task assignments and project updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 opacity-60 grayscale">
              <div className="w-6 h-6 bg-slate-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-[10px]">W</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-white">Workspace</span>
           </div>
           <p className="text-slate-600 text-xs">
             &copy; 2026 Workspace. A simple project management solution.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
