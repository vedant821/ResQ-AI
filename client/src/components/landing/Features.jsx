import { motion } from 'framer-motion';
import {
  Brain,
  Camera,
  FileBarChart,
  Heart,
  MapPin,
  Shield,
  Zap,
  Bell,
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Computer Vision AI',
    description: 'Instantly classifies incident scenes from image uploads with high accuracy rates.',
    glow: 'group-hover:border-blue-500/30 group-hover:shadow-blue-500/5',
    iconColor: 'text-blue-400',
  },
  {
    icon: Brain,
    title: 'Severity Indexing',
    description: 'Advanced heuristic scoring models predict severity indices in real time.',
    glow: 'group-hover:border-purple-500/30 group-hover:shadow-purple-500/5',
    iconColor: 'text-purple-400',
  },
  {
    icon: Heart,
    title: 'Live First-Aid Generator',
    description: 'Tailors immediate step-by-step guidance instructions for active bystanders.',
    glow: 'group-hover:border-red-500/30 group-hover:shadow-red-500/5',
    iconColor: 'text-red-400',
  },
  {
    icon: FileBarChart,
    title: 'Structured Auditing',
    description: 'Synthesizes incident reports containing telemetry logs for responder dispatch.',
    glow: 'group-hover:border-green-500/30 group-hover:shadow-green-500/5',
    iconColor: 'text-green-400',
  },
  {
    icon: Zap,
    title: 'Central Control Hub',
    description: 'Real-time telemetry dashboards aggregate active cases by threat severity.',
    glow: 'group-hover:border-amber-500/30 group-hover:shadow-amber-500/5',
    iconColor: 'text-amber-400',
  },
  {
    icon: MapPin,
    title: 'Geo-Tracking Routing',
    description: 'Pins accurate coordinate logs to speed up dispatch routes and response times.',
    glow: 'group-hover:border-cyan-500/30 group-hover:shadow-cyan-500/5',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Bell,
    title: 'Interactive Alerts',
    description: 'Sends automated updates across dispatch crews and bystanders.',
    glow: 'group-hover:border-orange-500/30 group-hover:shadow-orange-500/5',
    iconColor: 'text-orange-400',
  },
  {
    icon: Shield,
    title: 'Crisis Queue Sorting',
    description: 'Automates critical incident sorting queues to focus responders on high-risk cases.',
    glow: 'group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative bg-dark-950/40">
      <div className="absolute inset-0 bg-radial-gradient opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-24">
          <p className="text-accent-400 text-xs font-bold uppercase tracking-widest mb-3">Intelligence Core</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-6">
            Autonomous triage systems <br/>
            <span className="text-dark-400">built for the frontlines.</span>
          </h2>
          <p className="text-dark-400 text-base leading-relaxed max-w-2xl">
            Every layer of ResQ AI is engineered to minimize coordination friction, ensuring life-saving dispatch telemetry reaches first responders instantly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`glass-card p-6 flex flex-col justify-between group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feature.glow}`}
            >
              <div>
                {/* Icon wrapper */}
                <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 ${feature.iconColor}`}>
                  <feature.icon size={20} className="transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-accent-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative light line at card bottom */}
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 mt-6 transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
