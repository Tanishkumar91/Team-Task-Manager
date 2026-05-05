import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProject } from '../store/projectSlice';
import ProjectCard from '../components/ProjectCard';
import { Plus, X, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const filteredProjects = (projects || []).filter(p => 
    (p.title?.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
    (p.description?.toLowerCase().includes((searchQuery || '').toLowerCase()))
  );

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createProject(formData));
    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Projects</h1>
          <p className="text-slate-400 mt-1">Manage and track all your active workspaces.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-dark-surface p-1 rounded-lg border border-dark-border">
            <button className="p-2 rounded-md bg-slate-800 text-primary-400 shadow-sm">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 rounded-md text-slate-500 hover:text-slate-300 transition-colors">
              <ListIcon size={18} />
            </button>
          </div>
          {user?.role === 'Admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} /> Create Project
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full glass p-12 text-center rounded-2xl border-dashed border-2 border-dark-border">
              <p className="text-slate-400">No projects found. Create your first one to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-dark-border flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Create New Project</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={onSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Project Title</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="e.g. Website Redesign"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    rows="4"
                    className="input-field w-full resize-none"
                    placeholder="Briefly describe the project goals..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-lg border border-dark-border text-slate-300 font-medium hover:bg-slate-800 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-3">
                    Launch Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
