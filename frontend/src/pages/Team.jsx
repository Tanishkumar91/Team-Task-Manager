import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Shield, User, Loader2, Search } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.ui);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/users`, config);
        setMembers(data);
      } catch (error) {
        console.error('Error fetching team', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [user]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Team Directory</h1>
        <p className="text-slate-400 mt-1">Manage and connect with your colleagues.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl group hover:border-primary-500/50 transition-all border border-dark-border shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                    <Shield size={14} className="text-primary-400" />
                    {member.role}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-dark-border">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Mail size={16} className="text-slate-500" />
                  {member.email}
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <User size={16} className="text-slate-500" />
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-primary-600 hover:text-white transition-all">
                View Profile
              </button>
            </motion.div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="col-span-full glass p-12 text-center rounded-2xl border-dashed border-2 border-dark-border">
              <p className="text-slate-400">No team members found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Team;
