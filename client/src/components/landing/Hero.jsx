import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Activity } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-radial-gradient" />
      
      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[15%] w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-[15%] w-80 h-80 bg-emergency-500/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] right-[30%] w-60 h-60 bg-violet-500/8 rounded-full blur-[80px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 text-sm"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-dark-300">AI-Powered Emergency Response</span>
            <Zap size={14} className="text-primary-400" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
          >
            <span className="text-white">Every Second</span>
            <br />
            <span className="gradient-text-emergency">Saves a Life</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed text-balance"
          >
            An AI-powered emergency incident triage system that instantly classifies emergencies,
            estimates severity, and generates life-saving first-aid guidance — giving responders
            the critical information they need, when they need it most.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-danger text-base px-8 py-4 flex items-center gap-2 group">
              <Shield size={20} />
              Report Emergency
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-outline text-base px-8 py-4">
              Sign In
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-12"
          >
            {[
              { value: '847+', label: 'Incidents Handled' },
              { value: '<12 min', label: 'Avg Response Time' },
              { value: '94%', label: 'AI Accuracy' },
              { value: '24/7', label: 'Active Monitoring' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-dark-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Pulse indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-3 pt-8"
          >
            <Activity size={16} className="text-emergency-400" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1 h-4 bg-emergency-400 rounded-full"
                />
              ))}
            </div>
            <span className="text-xs text-dark-500">LIVE MONITORING ACTIVE</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
