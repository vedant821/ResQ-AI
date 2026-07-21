import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIncidents } from '../../hooks/useIncidents';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  Brain,
  AlertTriangle,
  Activity,
  Heart,
  Truck,
  FileCheck,
  ArrowLeft,
  CheckCircle,
  Shield,
  Clock,
  Target,
  Lightbulb,
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

export default function AIAnalysis() {
  const { id } = useParams();
  const { getIncident } = useIncidents();
  const navigate = useNavigate();
  const incident = getIncident(id);

  if (!incident) {
    return (
      <div className="text-center py-20">
        <AlertTriangle size={48} className="text-dark-600 mx-auto mb-4" />
        <p className="text-dark-400">Incident not found</p>
        <Link to="/dashboard" className="text-primary-400 text-sm mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const analysis = incident.analysis;
  const severityColors = {
    Critical: { bg: 'bg-red-500', ring: 'ring-red-500/30', text: 'text-red-400' },
    High: { bg: 'bg-orange-500', ring: 'ring-orange-500/30', text: 'text-orange-400' },
    Medium: { bg: 'bg-yellow-500', ring: 'ring-yellow-500/30', text: 'text-yellow-400' },
    Low: { bg: 'bg-green-500', ring: 'ring-green-500/30', text: 'text-green-400' },
  };
  const sevColor = severityColors[analysis?.severity] || severityColors.Medium;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-dark-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-dark-100 flex items-center gap-2">
              <Brain size={24} className="text-primary-400" />
              AI Analysis Report
            </h1>
            <p className="text-dark-400 text-sm mt-0.5">Incident #{incident.id}</p>
          </div>
        </div>
        <a 
          href={`/api/incidents/${incident.id}/pdf`}
          download
          className="btn-primary text-xs py-2.5 px-5 rounded-full flex items-center gap-2"
        >
          Download PDF Report
        </a>
      </div>

      {/* Analysis Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 bg-gradient-to-r from-green-500/10 to-primary-500/10 border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Analysis Complete</p>
            <p className="text-xs text-dark-400">AI has successfully analyzed the incident report</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Analysis Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Image Scan Telemetry */}
          {incident.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Brain size={18} className="text-primary-400" />
                Computer Vision Neural Scan
              </h3>
              <div className="relative rounded-xl overflow-hidden border border-dark-700 bg-black/40">
                <img
                  src={incident.imageUrl}
                  alt="Incident scan"
                  className="w-full max-h-[350px] object-cover"
                />
                
                {/* Scanner beam */}
                <motion.div 
                  animate={{ y: [-350, 350] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-primary-500/70 shadow-[0_0_15px_#2563eb] z-10 pointer-events-none"
                />

                {/* Overlaid bounding boxes */}
                {getBoundingBoxes(incident.type).map((box, i) => (
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
              <p className="text-xs text-dark-400 mt-3 italic">
                Scanning frame loaded into Vision AI model. Found {getBoundingBoxes(incident.type).length} telemetry anomaly boxes.
              </p>
            </motion.div>
          )}

          {/* Incident Classification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Target size={18} className="text-primary-400" />
              Incident Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-dark-800/50">
                <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Type</p>
                <p className="text-lg font-bold text-white">{analysis?.incidentType}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/50">
                <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Severity</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${sevColor.bg} ring-4 ${sevColor.ring}`} />
                  <p className={`text-lg font-bold ${sevColor.text}`}>{analysis?.severity}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/50">
                <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Confidence</p>
                <p className="text-lg font-bold text-primary-400">{analysis?.confidencePercent}%</p>
                <div className="mt-2 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis?.confidencePercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* First Aid Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Heart size={18} className="text-emergency-400" />
              First Aid Instructions
            </h3>
            <div className="space-y-3">
              {analysis?.firstAid?.map((instruction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-dark-800/30 hover:bg-dark-800/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emergency-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emergency-400">{index + 1}</span>
                  </div>
                  <p className="text-sm text-dark-300 leading-relaxed">{instruction}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-amber-400" />
              AI Recommendations
            </h3>
            <div className="space-y-2">
              {analysis?.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-dark-300">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Severity Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`glass-card p-6 bg-gradient-to-br ${
              analysis?.severity === 'Critical' ? 'from-red-500/10 to-red-600/5 border-red-500/20' :
              analysis?.severity === 'High' ? 'from-orange-500/10 to-orange-600/5 border-orange-500/20' :
              analysis?.severity === 'Medium' ? 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20' :
              'from-green-500/10 to-green-600/5 border-green-500/20'
            }`}
          >
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ring-4 ${sevColor.ring} ${sevColor.bg}/20`}>
                <Shield size={36} className={sevColor.text} />
              </div>
              <p className={`text-2xl font-bold mt-4 ${sevColor.text}`}>{analysis?.severity}</p>
              <p className="text-xs text-dark-500 mt-1">Severity Level</p>
              <p className="text-xs text-dark-500 mt-2">Priority Score: {analysis?.priorityScore}/4</p>
            </div>
          </motion.div>

          {/* Emergency Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Truck size={16} className="text-primary-400" />
              Emergency Services Required
            </h3>
            <div className="space-y-2">
              {analysis?.emergencyServices?.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-800/30"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-400" />
                  <span className="text-sm text-dark-300">{service}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Incident Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-white mb-4">Incident Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-dark-500">Title</p>
                <p className="text-dark-200">{incident.title}</p>
              </div>
              <div>
                <p className="text-dark-500">Location</p>
                <p className="text-dark-200">{incident.location}</p>
              </div>
              <div>
                <p className="text-dark-500">Status</p>
                <Badge variant="status" type={incident.status} />
              </div>
              <div>
                <p className="text-dark-500">Reported</p>
                <p className="text-dark-200">
                  {new Date(incident.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/history" className="block">
              <Button variant="primary" className="w-full">
                <FileCheck size={16} />
                View All Reports
              </Button>
            </Link>
            <Link to="/report" className="block">
              <Button variant="outline" className="w-full">
                <AlertTriangle size={16} />
                Report Another
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
