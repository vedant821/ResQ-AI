import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: form.location,
      });
      navigate('/dashboard');
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
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-10 right-[20%] w-72 h-72 bg-primary-500/10 rounded-full blur-[80px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-10 left-[20%] w-64 h-64 bg-emergency-500/8 rounded-full blur-[80px]"
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
          <h1 className="text-xl font-semibold text-dark-100">Create Account</h1>
          <p className="text-sm text-dark-400 mt-1">Register as a citizen to report emergencies</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange('name')}
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Min 6 chars"
                value={form.password}
                onChange={handleChange('password')}
                required
              />
              <Input
                label="Confirm"
                type="password"
                icon={Lock}
                placeholder="Re-enter"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              icon={Phone}
              placeholder="+91 XXXXXXXXXX"
              value={form.phone}
              onChange={handleChange('phone')}
            />

            <Input
              label="Location"
              icon={MapPin}
              placeholder="City, State"
              value={form.location}
              onChange={handleChange('location')}
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
