import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'Team', icon: Users, path: '/team' },
  ];

  return (
    <aside className="w-64 glass border-r-0 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/40">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Ethera</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full p-3 rounded-xl hover:bg-red-400/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
