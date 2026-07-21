import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { Activity, Clock } from 'lucide-react';

export default function ActivityTimeline({ incidents }) {
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);

  const typeEmoji = {
    'Road Accident': '🚗',
    'Fire': '🔥',
    'Flood': '🌊',
    'Medical Emergency': '🏥',
    'Earthquake': '🌍',
    'Building Collapse': '🏚️',
    'Gas Leak': '💨',
    'Chemical Spill': '☣️',
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-dark-100 flex items-center gap-2 mb-4">
        <Activity size={16} className="text-primary-400" />
        Recent Activity
      </h3>

      <div className="space-y-1">
        {recentIncidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-dark-800/30 transition-colors"
          >
            {/* Timeline dot */}
            <div className="relative flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full ${
                incident.severity === 'Critical' ? 'bg-red-400' :
                incident.severity === 'High' ? 'bg-orange-400' :
                incident.severity === 'Medium' ? 'bg-yellow-400' :
                'bg-green-400'
              }`} />
              {index < recentIncidents.length - 1 && (
                <div className="w-px h-8 bg-dark-700 mt-1" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm">{typeEmoji[incident.type] || '🆘'}</span>
                <p className="text-xs font-medium text-dark-100 truncate">{incident.title}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge type={incident.severity} className="text-[10px] px-1.5 py-0" />
                <Badge variant="status" type={incident.status} className="text-[10px] px-1.5 py-0" />
              </div>
              <p className="text-[10px] text-dark-500 mt-1 flex items-center gap-1">
                <Clock size={10} />
                {getTimeAgo(incident.updatedAt)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {recentIncidents.length === 0 && (
        <p className="text-sm text-dark-500 text-center py-4">No recent activity</p>
      )}
    </div>
  );
}
