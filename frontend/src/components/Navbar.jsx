import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Bell, Search, ChevronDown, CheckCircle2, Clock, UserPlus } from 'lucide-react';
import { setSearchQuery } from '../store/uiSlice';
import axios from 'axios';
import API_BASE_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.ui);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/notifications`, config);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(`${API_BASE_URL}/notifications/read-all`, {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  };

  return (
    <nav className="h-16 px-6 glass border-l-0 border-t-0 flex items-center justify-between sticky top-0 z-[100]">
      <div className="relative w-96">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search projects or tasks..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="bg-slate-800/50 border-none rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:ring-1 focus:ring-primary-500 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markAllRead();
            }}
            className="text-slate-400 hover:text-white transition-colors relative p-2 rounded-full hover:bg-slate-800"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-dark-bg">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 glass rounded-2xl border border-dark-border shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-dark-border flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                    <button onClick={markAllRead} className="text-[10px] uppercase tracking-wider font-bold text-primary-400 hover:text-primary-300">Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n._id} className={`p-4 border-b border-dark-border/50 hover:bg-slate-800/40 transition-colors ${!n.isRead ? 'bg-primary-500/5' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              n.type === 'task_assigned' ? 'bg-indigo-500/20 text-indigo-400' :
                              n.type === 'member_added' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {n.type === 'task_assigned' ? <Clock size={16} /> :
                               n.type === 'member_added' ? <UserPlus size={16} /> : <CheckCircle2 size={16} />}
                            </div>
                            <div>
                              <p className="text-xs text-slate-200 leading-tight">{n.message}</p>
                              <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                                <Clock size={10} />
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-500">
                        <Bell size={32} className="mx-auto mb-3 opacity-10" />
                        <p className="text-xs">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-dark-border"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400 mt-1">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center border-2 border-dark-border group-hover:border-primary-400 transition-all shadow-lg">
            <span className="text-white font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-white transition-all" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
