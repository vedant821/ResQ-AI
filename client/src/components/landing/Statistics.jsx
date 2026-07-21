import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  {
    icon: AlertTriangle,
    value: 847,
    suffix: '+',
    label: 'Incidents Reported',
    description: 'Emergency reports processed',
    color: 'text-emergency-400',
    bg: 'bg-emergency-500/10',
  },
  {
    icon: Clock,
    value: 12,
    suffix: ' min',
    label: 'Avg Response Time',
    description: 'From report to dispatch',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
  {
    icon: CheckCircle,
    value: 94,
    suffix: '%',
    label: 'AI Accuracy',
    description: 'Incident classification rate',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Users,
    value: 1250,
    suffix: '+',
    label: 'Lives Impacted',
    description: 'People helped by ResQ AI',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

export default function Statistics() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Impact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-4">
            Making a <span className="gradient-text">Difference</span>
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            Real numbers that represent real lives saved through faster emergency response.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon size={26} className={stat.color} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-dark-100 mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-dark-100 font-medium mb-1">{stat.label}</p>
              <p className="text-xs text-dark-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
