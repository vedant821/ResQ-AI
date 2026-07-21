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

const getBoundingBoxes = (type) => {
  switch (type) {
    case 'Road Accident':
      return [
        { label: 'Vehicle Damage: 94%', x: '12%', y: '18%', w: '40%', h: '55%', color: 'border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]' },
        { label: 'Road Obstruction: 89%', x: '52%', y: '35%', w: '38%', h: '45%', color: 'border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]' },
      ];
    case 'Fire':
      return [
        { label: 'Active Fire Source: 92%', x: '22%', y: '12%', w: '55%', h: '65%', color: 'border-red-600 text-red-500 shadow-[0_0_8px_rgba(220,38,38,0.4)]' },
        { label: 'Smoke Plume: 85%', x: '8%', y: '3%', w: '84%', h: '32%', color: 'border-slate-500 text-slate-400 shadow-[0_0_8px_rgba(100,116,139,0.3)]' },
      ];
    case 'Flood':
      return [
        { label: 'Water Submersion: 96%', x: '4%', y: '28%', w: '92%', h: '68%', color: 'border-blue-500 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]' },
      ];
    case 'Gas Leak':
    case 'Chemical Spill':
      return [
        { label: 'Hazard Dispersion: 90%', x: '18%', y: '22%', w: '64%', h: '64%', color: 'border-green-500 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]' },
      ];
    default:
      return [
        { label: 'Anomalous Incident: 88%', x: '12%', y: '12%', w: '76%', h: '76%', color: 'border-primary-500 text-primary-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]' },
      ];
  }
};

function AdminDispatchTracker({ incident }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const calculateETA = () => {
      const totalDuration = 5 * 60 * 1000;
      const elapsed = Date.now() - new Date(incident.createdAt).getTime();
      const remaining = Math.max(0, totalDuration - elapsed);
      
      setTimeLeft(Math.floor(remaining / 1000));

      const ratio = Math.min(1, elapsed / totalDuration);
      setPercent(Math.round(ratio * 100));

      const totalDist = 3.5;
      setDistance(Math.max(0, totalDist - ratio * totalDist));
    };

    calculateETA();
    const timer = setInterval(calculateETA, 1000);
    return () => clearInterval(timer);
  }, [incident.createdAt]);

  const formatTime = (secs) => {
    if (secs === 0) return 'Arrived on Scene';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s (Dist: ${distance.toFixed(2)} km)`;
  };

  return (
    <div className="mt-3 space-y-2 border-t border-dark-700/60 pt-3">
      <div className="flex justify-between text-[10px] text-dark-400">
        <span>Responder Progress</span>
        <span className="font-semibold text-primary-400">{formatTime(timeLeft)}</span>
      </div>
      <div className="relative h-4 bg-dark-900 border border-dark-700 rounded-full flex items-center px-2 overflow-hidden">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-primary-500/10 transition-all duration-1000" 
          style={{ width: `${percent}%` }} 
        />
        <div 
          className="absolute text-xs" 
          style={{ left: `calc(${percent}% - 8px)` }}
        >
          {incident.dispatchedUnits.includes('Ambulance') ? '🚑' :
           incident.dispatchedUnits.includes('Fire Truck') ? '🚒' :
           incident.dispatchedUnits.includes('Police') ? '🚓' : '☣️'}
        </div>
      </div>
    </div>
  );
}

export default function IncidentTable() {
  const { incidents, updateStatus } = useIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);

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

  const openStatusModal = (incident) => {
    setSelectedIncident(incident);
    setTargetStatus(incident.status);
    setSelectedUnits(incident.dispatchedUnits || []);
    setStatusModalOpen(true);
  };

  const toggleUnit = (unit) => {
    setSelectedUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  const handleStatusChange = (newStatus, units = selectedUnits) => {
    if (selectedIncident) {
      updateStatus(selectedIncident.id, newStatus, units);
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
                        onClick={() => openStatusModal(incident)}
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
                  type="button"
                  onClick={() => {
                    setTargetStatus(status);
                    if (status !== 'Assigned' && status !== 'In Progress') {
                      setSelectedUnits([]);
                    }
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                    targetStatus === status
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400 font-semibold'
                      : 'bg-dark-800/30 border-dark-700 text-dark-300 hover:bg-dark-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {(targetStatus === 'Assigned' || targetStatus === 'In Progress') && (
              <div className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/50 space-y-3">
                <p className="text-xs font-semibold text-primary-400">🚨 Dispatch Crew Vehicles:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Ambulance', 'Fire Truck', 'Police', 'Hazmat'].map((unit) => {
                    const isSelected = selectedUnits.includes(unit);
                    return (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => toggleUnit(unit)}
                        className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                            : 'bg-dark-900/50 border-dark-700 text-dark-400 hover:border-dark-600'
                        }`}
                      >
                        <span>
                          {unit === 'Ambulance' && '🚑 '}
                          {unit === 'Fire Truck' && '🚒 '}
                          {unit === 'Police' && '🚓 '}
                          {unit === 'Hazmat' && '☣️ '}
                          {unit}
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => handleStatusChange(targetStatus)}
              className="btn-primary w-full text-sm py-3 mt-4"
            >
              Confirm Status & Dispatch Action
            </button>
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
            {selectedIncident.imageUrl && (
              <div className="p-3 rounded-xl bg-dark-800/30">
                <p className="text-xs text-dark-500 mb-2">📸 Computer Vision Telemetry</p>
                <div className="relative rounded-lg overflow-hidden border border-dark-700 bg-black/40">
                  <img
                    src={selectedIncident.imageUrl}
                    alt="Incident Triage preview"
                    className="w-full max-h-60 object-cover"
                  />
                  
                  {/* Scanner beam */}
                  <motion.div 
                    animate={{ y: [-240, 240] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-primary-500/70 shadow-[0_0_15px_#2563eb] z-10 pointer-events-none"
                  />

                  {/* Overlaid bounding boxes */}
                  {getBoundingBoxes(selectedIncident.type).map((box, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className={`absolute border-2 ${box.color} rounded p-1 flex flex-col justify-between`}
                      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
                    >
                      <span className="bg-dark-950/90 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded w-fit border border-dark-700 leading-none">
                        {box.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3 rounded-xl bg-dark-800/30">
              <p className="text-xs text-dark-500 mb-1">Description</p>
              <p className="text-sm text-dark-300 leading-relaxed">{selectedIncident.description}</p>
            </div>
            {selectedIncident.dispatchedUnits && selectedIncident.dispatchedUnits.length > 0 && (
              <div className="p-3 rounded-xl bg-dark-800/30 border border-primary-500/20">
                <p className="text-xs text-primary-400 font-bold mb-2">⚡ Active Dispatches</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.dispatchedUnits.map((unit) => (
                    <span
                      key={unit}
                      className="px-2.5 py-1 text-xs font-semibold bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full"
                    >
                      {unit === 'Ambulance' && '🚑 '}
                      {unit === 'Fire Truck' && '🚒 '}
                      {unit === 'Police' && '🚓 '}
                      {unit === 'Hazmat' && '☣️ '}
                      {unit}
                    </span>
                  ))}
                </div>
                {/* Admin Live tracking en-route */}
                {(selectedIncident.status === 'Assigned' || selectedIncident.status === 'In Progress') && (
                  <AdminDispatchTracker incident={selectedIncident} />
                )}
              </div>
            )}
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
