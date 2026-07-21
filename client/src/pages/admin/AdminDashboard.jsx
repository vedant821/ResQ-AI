import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIncidents } from '../../hooks/useIncidents';
import StatsCard from '../../components/ui/StatsCard';
import Badge from '../../components/ui/Badge';
import IncidentTable from '../../components/dashboard/IncidentTable';
import AnalyticsCharts from '../../components/dashboard/AnalyticsCharts';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import {
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Terminal,
} from 'lucide-react';

function ResponderRadioLogs({ incidents }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const newLogs = [];
    incidents.forEach((inc) => {
      const timeStr = new Date(inc.created_at || inc.createdAt || Date.now()).toLocaleTimeString();
      
      newLogs.push({
        time: timeStr,
        source: 'SYSTEM',
        message: `Triage lock acquired on ${inc.id}. Severity: ${inc.severity}.`,
      });

      if (inc.dispatched_units || inc.dispatchedUnits) {
        const units = inc.dispatched_units || inc.dispatchedUnits || [];
        units.forEach((unit) => {
          newLogs.push({
            time: timeStr,
            source: 'TWILIO',
            message: `SMS notification broadcasted to ${unit} dispatch officer. Destination: ${inc.location}.`,
          });
          newLogs.push({
            time: timeStr,
            source: unit.toUpperCase(),
            message: `Radio Ping ACK: Unit status updated to 'En Route'. Navigation coordinates locked.`,
          });
        });
      }
    });

    setLogs(newLogs.slice(-10));
  }, [incidents]);

  return (
    <div className="glass-card p-6 border border-dark-700/60 flex flex-col h-[280px]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal size={16} className="text-primary-400" />
          Responder Telemetry & Twilio SMS Logs
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span className="text-[10px] text-dark-500 font-mono">RADIO ACTIVE</span>
        </div>
      </div>
      
      <div className="flex-1 bg-black/40 border border-dark-700 rounded-xl p-3 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[180px] custom-scrollbar">
        {logs.length === 0 ? (
          <p className="text-dark-500 italic text-center pt-8">No radio logs or SMS broadcasts recorded.</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed flex gap-2">
              <span className="text-dark-500">[{log.time}]</span>
              <span className={`font-semibold ${
                log.source === 'SYSTEM' ? 'text-primary-400' :
                log.source === 'TWILIO' ? 'text-amber-400' :
                'text-green-400'
              }`}>
                {log.source}:
              </span>
              <span className="text-dark-300 flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { incidents, analytics } = useIncidents();
  const [activeTab, setActiveTab] = useState('overview');

  const total = incidents.length;
  const critical = incidents.filter((i) => i.severity === 'Critical').length;
  const resolved = incidents.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;
  const pending = incidents.filter((i) => i.status === 'Pending').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'incidents', label: 'All Incidents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield size={24} className="text-primary-400" />
            Admin Dashboard
          </h1>
          <p className="text-dark-400 text-sm mt-1">Monitor and manage emergency incidents</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-dark-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Monitoring Active
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          title="Total Reports"
          value={total}
          trend="+12% this week"
          trendUp={true}
          color="primary"
          delay={0}
        />
        <StatsCard
          icon={AlertTriangle}
          title="Critical"
          value={critical}
          trend="Needs attention"
          trendUp={false}
          color="emergency"
          delay={0.1}
        />
        <StatsCard
          icon={CheckCircle}
          title="Resolved"
          value={resolved}
          trend={`${total > 0 ? Math.round((resolved / total) * 100) : 0}% rate`}
          trendUp={true}
          color="success"
          delay={0.2}
        />
        <StatsCard
          icon={Clock}
          title="Pending"
          value={pending}
          trend="Awaiting response"
          color="warning"
          delay={0.3}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-800/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsCharts data={analytics} compact />
          </div>
          <div className="space-y-6">
            <ActivityTimeline incidents={incidents} />
            <ResponderRadioLogs incidents={incidents} />
          </div>
        </div>
      )}

      {activeTab === 'incidents' && <IncidentTable />}

      {activeTab === 'analytics' && <AnalyticsCharts data={analytics} />}
    </div>
  );
}
