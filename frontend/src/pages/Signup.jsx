import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/authSlice';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(reset());
  }, [user, navigate, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-dark-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl my-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mb-6 mx-auto flex items-center justify-center shadow-lg shadow-primary-600/30">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-sm">Create your workspace account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="text"
                className="input-field w-full pl-12 bg-slate-900/40 border-white/5"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="email"
                className="input-field w-full pl-12 bg-slate-900/40 border-white/5"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="password"
                className="input-field w-full pl-12 bg-slate-900/40 border-white/5"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Role</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <select
                className="input-field w-full pl-12 bg-[#1A1D2D]/60"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Member">Team Member</option>
                <option value="Admin">Project Admin</option>
              </select>
            </div>
          </div>

          {isError && (
            <p className="text-rose-500 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center font-medium">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group mt-4 shadow-xl shadow-primary-600/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/30">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
