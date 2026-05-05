import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(reset());
  }, [user, navigate, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-dark-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mb-6 mx-auto flex items-center justify-center shadow-lg shadow-primary-600/30">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your workspace</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="email"
                className="input-field w-full pl-12 bg-slate-900/40 border-white/5 focus:bg-slate-900/80 transition-all"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="password"
                className="input-field w-full pl-12 bg-slate-900/40 border-white/5 focus:bg-slate-900/80 transition-all"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
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
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group shadow-xl shadow-primary-600/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          New here?{' '}
          <Link to="/signup" className="text-primary-400 font-bold hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/30">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
