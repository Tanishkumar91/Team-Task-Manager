import { motion } from 'framer-motion';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-2xl group border border-dark-border hover:border-primary-500/50 transition-all duration-300 shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-primary-600/10 p-3 rounded-xl">
          <Calendar className="text-primary-400" size={20} />
        </div>
        <div className="flex -space-x-2">
          {project.members?.slice(0, 2).map((member, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 border-2 border-dark-bg flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
              {member.name?.charAt(0)}
            </div>
          ))}
          {project.members?.length > 2 && (
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-dark-bg flex items-center justify-center text-[10px] font-bold text-primary-400 shadow-lg">
              +{project.members.length - 2}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
        {project.title}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
        {project.description}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-dark-border">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
          <Users size={14} />
          {project.members?.length} Members
        </div>
        <Link 
          to={`/projects/${project._id}`}
          className="text-primary-400 hover:text-primary-300 text-sm font-bold flex items-center gap-1 transition-all group-hover:gap-2"
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
