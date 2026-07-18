import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, title, value, trend, trendUp, color = 'primary', delay = 0 }) {
  const colors = {
    primary: 'from-primary-500/20 to-primary-600/5 text-primary-400 border-primary-500/20',
    emergency: 'from-emergency-500/20 to-emergency-600/5 text-emergency-400 border-emergency-500/20',
    success: 'from-green-500/20 to-green-600/5 text-green-400 border-green-500/20',
    warning: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
    purple: 'from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/20',
  };

  const iconColors = {
    primary: 'bg-primary-500/20 text-primary-400',
    emergency: 'bg-emergency-500/20 text-emergency-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-violet-500/20 text-violet-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card p-5 bg-gradient-to-br ${colors[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-dark-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-green-400' : 'text-emergency-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
