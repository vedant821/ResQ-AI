import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIncidents } from '../../hooks/useIncidents';
import { STATUS_OPTIONS } from '../../services/mockData';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit3,
  MapPin,
  Clock,
  User,
  AlertTriangle,
} from 'lucide-react';

export default function IncidentTable() {
  const { incidents, updateStatus } = useIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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

  let filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.reporterName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || inc.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'severity') {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
    }
    return 0;
  });

  const handleStatusChange = (newStatus) => {
    if (selectedIncident) {
      updateStatus(selectedIncident.id, newStatus);
      setStatusModalOpen(false);
      setSelectedIncident(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search by title, ID, type, or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-field w-auto cursor-pointer text-sm"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto cursor-pointer text-sm"
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto cursor-pointer text-sm"
          >
            <option value="date">Sort: Newest</option>
            <option value="severity">Sort: Severity</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3">Incident</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Reporter</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3">Severity</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((incident, index) => (
                <motion.tr
                  key={incident.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{typeEmoji[incident.type] || '🆘'}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{incident.title}</p>
                        <p className="text-xs text-dark-500">{incident.type} • #{incident.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-dark-300">{incident.reporterName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge type={incident.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="status" type={incident.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-dark-400">
                      {new Date(incident.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setSelectedIncident(incident); setDetailModalOpen(true); }}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => { setSelectedIncident(incident); setStatusModalOpen(true); }}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-dark-700 transition-colors"
                        title="Update Status"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <AlertTriangle size={32} className="text-dark-600 mx-auto mb-2" />
            <p className="text-dark-400 text-sm">No incidents match your filters</p>
          </div>
        )}
        <div className="px-4 py-3 border-t border-dark-800/50 text-xs text-dark-500">
          Showing {filtered.length} of {incidents.length} incidents
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setSelectedIncident(null); }}
        title="Update Incident Status"
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-dark-800/50">
              <p className="text-sm font-medium text-white">{selectedIncident.title}</p>
              <p className="text-xs text-dark-400 mt-1">
                Current: <Badge variant="status" type={selectedIncident.status} className="ml-1" />
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={status === selectedIncident.status}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    status === selectedIncident.status
                      ? 'bg-dark-800/50 text-dark-500 cursor-not-allowed'
                      : 'bg-dark-800/30 text-dark-300 hover:bg-primary-500/10 hover:text-primary-400 border border-dark-700 hover:border-primary-500/30'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedIncident(null); }}
        title="Incident Details"
        size="lg"
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-1">Type</p>
                <p className="text-sm text-white">{typeEmoji[selectedIncident.type]} {selectedIncident.type}</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-1">Severity</p>
                <Badge type={selectedIncident.severity} />
              </div>
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-1">Status</p>
                <Badge variant="status" type={selectedIncident.status} />
              </div>
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-1">Confidence</p>
                <p className="text-sm text-primary-400 font-semibold">{selectedIncident.confidence ? `${Math.round(selectedIncident.confidence * 100)}%` : 'N/A'}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-dark-800/30">
              <p className="text-xs text-dark-500 mb-1">Description</p>
              <p className="text-sm text-dark-300 leading-relaxed">{selectedIncident.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-1">📍 Location</p>
                <p className="text-sm text-dark-300">{selectedIncident.location}</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-1">👤 Reporter</p>
                <p className="text-sm text-dark-300">{selectedIncident.reporterName}</p>
              </div>
            </div>
            {selectedIncident.analysis?.firstAid && (
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-2">🩹 First Aid (Top 3)</p>
                <ul className="space-y-1">
                  {selectedIncident.analysis.firstAid.slice(0, 3).map((aid, i) => (
                    <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                      <span className="text-primary-400 font-bold">{i + 1}.</span>
                      {aid}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
