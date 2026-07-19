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
    title: 'Image-Based Analysis',
    description: 'Upload incident photos for instant AI-powered classification and severity assessment.',
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    icon: Brain,
    title: 'AI Severity Prediction',
    description: 'Advanced algorithms estimate incident severity — Critical, High, Medium, or Low — in seconds.',
    color: 'from-violet-500/20 to-violet-600/5',
    iconColor: 'bg-violet-500/20 text-violet-400',
  },
  {
    icon: Heart,
    title: 'First-Aid Guidance',
    description: 'Get immediate, step-by-step first-aid instructions tailored to the specific emergency type.',
    color: 'from-red-500/20 to-red-600/5',
    iconColor: 'bg-red-500/20 text-red-400',
  },
  {
    icon: FileBarChart,
    title: 'Automated Reports',
    description: 'Structured incident reports generated automatically with all critical details for responders.',
    color: 'from-green-500/20 to-green-600/5',
    iconColor: 'bg-green-500/20 text-green-400',
  },
  {
    icon: Zap,
    title: 'Real-time Dashboard',
    description: 'Live monitoring dashboard for administrators to track, prioritize, and manage incidents.',
    color: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    icon: MapPin,
    title: 'Location Tracking',
    description: 'Precise location reporting to help emergency services reach incident sites faster.',
    color: 'from-cyan-500/20 to-cyan-600/5',
    iconColor: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Real-time status updates and notifications for both citizens and administrators.',
    color: 'from-orange-500/20 to-orange-600/5',
    iconColor: 'bg-orange-500/20 text-orange-400',
  },
  {
    icon: Shield,
    title: 'Priority Assignment',
    description: 'AI automatically assigns priority scores to ensure critical incidents get attention first.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'bg-emerald-500/20 text-emerald-400',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-radial-gradient opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Every feature is designed to minimize response time and maximize the chance of saving lives during emergencies.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`glass-card p-6 bg-gradient-to-br ${feature.color} group`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={22} />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
