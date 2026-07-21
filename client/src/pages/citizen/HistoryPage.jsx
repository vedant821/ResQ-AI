import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIncidents } from '../../hooks/useIncidents';
import Badge from '../../components/ui/Badge';
import { History, Search, Filter, Eye, AlertTriangle } from 'lucide-react';

export default function HistoryPage() {
  const { getUserIncidents } = useIncidents();
  const myIncidents = getUserIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');

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

  const filtered = myIncidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History size={24} className="text-primary-400" />
          Report History
        </h1>
        <p className="text-dark-400 text-sm mt-1">View and track all your submitted emergency reports</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-dark-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-field w-auto cursor-pointer"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <AlertTriangle size={48} className="text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 mb-1">No reports found</p>
          <p className="text-sm text-dark-500">
            {myIncidents.length === 0
              ? 'You haven\'t submitted any reports yet'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/analysis/${incident.id}`}>
                <div className="glass-card p-5 hover:border-primary-500/30 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-xl flex-shrink-0">
                        {typeEmoji[incident.type] || '🆘'}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                            {incident.title}
                          </h3>
                          <span className="text-xs text-dark-600">#{incident.id}</span>
                        </div>
                        <p className="text-xs text-dark-400 line-clamp-1">
                          {incident.description}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap text-xs text-dark-500">
                          <span>📍 {incident.location}</span>
                          <span>
                            🕐{' '}
                            {new Date(incident.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span>📊 Confidence: {incident.confidence ? `${Math.round(incident.confidence * 100)}%` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge type={incident.severity} />
                      <Badge variant="status" type={incident.status} />
                      <Eye size={16} className="text-dark-600 group-hover:text-primary-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-dark-600 text-center">
        Showing {filtered.length} of {myIncidents.length} reports
      </p>
    </div>
  );
}
