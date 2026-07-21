import { useState } from 'react';
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
} from 'lucide-react';

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
          <div>
            <ActivityTimeline incidents={incidents} />
          </div>
        </div>
      )}

      {activeTab === 'incidents' && <IncidentTable />}

      {activeTab === 'analytics' && <AnalyticsCharts data={analytics} />}
    </div>
  );
}
