import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Brain, AlertTriangle, Activity, Heart, Eye } from 'lucide-react';

export default function Hero() {
  // Mouse Parallax Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for parallax layers
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950 pt-24 noise-bg"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid opacity-80" />
      <div className="absolute inset-0 bg-radial-gradient" />

      {/* Aurora Orbs */}
      <motion.div
        animate={{ 
          x: [0, 80, -50, 0], 
          y: [0, -50, 60, 0],
          scale: [1, 1.15, 0.9, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-[10%] w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ 
          x: [0, -60, 70, 0], 
          y: [0, 80, -40, 0],
          scale: [1, 0.9, 1.1, 1] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-[10%] w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[130px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-accent-300"
            >
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              Vision AI Incident Dispatch Engine
            </motion.div>

            {/* Main Hero Header (72px desktop) */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.05]"
            >
              <span className="text-white">Every Second</span>
              <br />
              <span className="gradient-text-emergency">Saves a Life.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-dark-400 text-base md:text-lg max-w-xl leading-relaxed text-balance"
            >
              ResQ AI coordinates crisis triage using next-gen computer vision. Instantly classify incident categories, predict severity indices, and dispatch automated live-saving emergency instructions to bystanders before the ambulance arrives.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register" className="btn-danger px-8 py-4 text-base rounded-full flex items-center justify-center gap-2.5 group">
                <Shield size={20} />
                Report Crisis Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-outline px-8 py-4 text-base rounded-full flex items-center justify-center">
                Launch Dashboard
              </Link>
            </motion.div>

            {/* Stats list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5"
            >
              {[
                { value: '12 min', label: 'Response Time' },
                { value: '94%', label: 'AI Accuracy' },
                { value: '24/7', label: 'Live Triage' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Interactive Parallax Floating Cards */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center"
            >
              {/* Main Mockup Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="w-full h-full glass-card p-6 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Brain size={16} className="text-red-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Vision AI Triage</p>
                      <p className="text-[10px] text-dark-400">Processing Incident stream...</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold uppercase tracking-wider animate-pulse">
                    Critical
                  </span>
                </div>

                {/* Simulated Image Stream Box */}
                <div className="my-4 aspect-[4/3] rounded-xl bg-slate-900 border border-white/5 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                  {/* Holographic scanning line */}
                  <motion.div 
                    animate={{ y: [-150, 150] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-accent-500/50 shadow-[0_0_15px_#06b6d4] z-20"
                  />
                  <Shield size={48} className="text-white/10" />
                  
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1.5"><Eye size={12} className="text-accent-400" /> Scanning frame...</span>
                    <span className="font-mono text-accent-400">98.4% Confidence</span>
                  </div>
                </div>

                {/* Lower dispatch progress details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-400">Classified Category:</span>
                    <span className="font-semibold text-white">Highway Multi-Vehicle Crash</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['20%', '85%', '85%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                      className="h-full bg-gradient-to-r from-red-500 to-accent-500 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-dark-400 italic">Dispatched medical crew, alert routed to trauma centers.</p>
                </div>
              </motion.div>

              {/* Floating Card 1: Pulse Graph Widget */}
              <motion.div
                initial={{ x: 60, y: -40, opacity: 0 }}
                animate={{ x: 45, y: -30, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-1/4 right-0 w-44 glass-card p-4 shadow-2xl pointer-events-none transform -translate-y-1/2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-accent-400" />
                  <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Telemetry</span>
                </div>
                <p className="text-lg font-black text-white leading-none">104 <span className="text-[10px] font-normal text-dark-400">BPM</span></p>
                
                {/* Micro SVG spark graph */}
                <svg className="w-full h-8 mt-2 text-accent-400" viewBox="0 0 100 30" fill="none">
                  <path d="M0 15 L20 15 L25 5 L30 25 L35 12 L40 15 L70 15 L75 0 L80 30 L85 10 L90 15 L100 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              {/* Floating Card 2: Alerts Dispatch Notification Capsule */}
              <motion.div
                initial={{ x: -60, y: 120, opacity: 0 }}
                animate={{ x: -35, y: 90, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-12 left-0 w-52 glass-card p-3 shadow-2xl pointer-events-none"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-red-500/25 text-red-400">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Emergency Dispatched</p>
                    <p className="text-[9px] text-dark-400 mt-0.5">Ambulance #12 arrived on site (4.2m)</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
