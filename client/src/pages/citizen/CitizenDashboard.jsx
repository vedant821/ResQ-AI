import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useIncidents } from '../../hooks/useIncidents';
import StatsCard from '../../components/ui/StatsCard';
import Badge from '../../components/ui/Badge';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Plus,
  ArrowRight,
  Activity,
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { getUserIncidents } = useIncidents();
  const myIncidents = getUserIncidents();

  const pending = myIncidents.filter((i) => i.status === 'Pending').length;
  const resolved = myIncidents.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;
  const inProgress = myIncidents.filter((i) => i.status === 'In Progress' || i.status === 'Assigned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-dark-400 text-sm mt-1">Here's an overview of your emergency reports</p>
        </div>
        <Link
          to="/report"
          className="btn-danger flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          Report Emergency
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          title="Total Reports"
          value={myIncidents.length}
          color="primary"
          delay={0}
        />
        <StatsCard
          icon={Clock}
          title="Pending"
          value={pending}
          color="warning"
          delay={0.1}
        />
        <StatsCard
          icon={Activity}
          title="In Progress"
          value={inProgress}
          color="purple"
          delay={0.2}
        />
        <StatsCard
          icon={CheckCircle}
          title="Resolved"
          value={resolved}
          color="success"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/report">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 bg-gradient-to-br from-emergency-500/10 to-emergency-600/5 border-emergency-500/20 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emergency-500/20 flex items-center justify-center emergency-pulse">
                <AlertTriangle size={28} className="text-emergency-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-100">Report Emergency</h3>
                <p className="text-sm text-dark-400">Upload image and describe the incident</p>
              </div>
              <ArrowRight size={20} className="text-dark-500 group-hover:text-emergency-400 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        </Link>

        <Link to="/history">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <FileText size={28} className="text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-100">View History</h3>
                <p className="text-sm text-dark-400">Check status of your previous reports</p>
              </div>
              <ArrowRight size={20} className="text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-100">Recent Reports</h2>
          <Link to="/history" className="text-sm text-primary-400 hover:text-primary-300">
            View All →
          </Link>
        </div>

        {myIncidents.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <AlertTriangle size={48} className="text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400 mb-2">No reports yet</p>
            <p className="text-sm text-dark-500 mb-4">Report an emergency to see it here</p>
            <Link to="/report" className="btn-primary text-sm inline-flex items-center gap-2">
              <Plus size={16} />
              Report Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myIncidents.slice(0, 5).map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-lg">
                      {incident.type === 'Road Accident' && '🚗'}
                      {incident.type === 'Fire' && '🔥'}
                      {incident.type === 'Flood' && '🌊'}
                      {incident.type === 'Medical Emergency' && '🏥'}
                      {incident.type === 'Earthquake' && '🌍'}
                      {incident.type === 'Building Collapse' && '🏚️'}
                      {incident.type === 'Gas Leak' && '💨'}
                      {incident.type === 'Chemical Spill' && '☣️'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-100">{incident.title}</p>
                      <p className="text-xs text-dark-500">
                        {new Date(incident.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge type={incident.severity} />
                    <Badge variant="status" type={incident.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
