import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-radial-gradient" />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-[20%] w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-[20%] w-72 h-72 bg-emergency-500/10 rounded-full blur-[80px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emergency-500 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-dark-50">ResQ</span>
              <span className="gradient-text"> AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-dark-100">Welcome Back</h1>
          <p className="text-sm text-dark-400 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-emergency-500/10 border border-emergency-500/20 text-emergency-400 text-sm mb-6"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" loading={loading} className="w-full">
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                Register
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-dark-800/30 border border-dark-700/50">
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Demo Accounts</p>
            <div className="space-y-2 text-xs text-dark-400">
              <div className="flex justify-between items-center">
                <span>👤 Citizen:</span>
                <code className="text-primary-400">rahul@gmail.com / user123</code>
              </div>
              <div className="flex justify-between items-center">
                <span>🛡️ Admin:</span>
                <code className="text-primary-400">admin@resqai.com / admin123</code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
