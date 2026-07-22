import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const IncidentContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Field name normaliser (snake_case DB → camelCase frontend) ────────────────
const mapIncident = (inc) => {
  if (!inc) return inc;

  const mappedAnalysis = inc.analysis
    ? {
        ...inc.analysis,
        incidentType: inc.analysis.incident_type || inc.analysis.incidentType,
        confidencePercent:
          inc.analysis.confidence_percent || inc.analysis.confidencePercent,
        firstAid: inc.analysis.first_aid || inc.analysis.firstAid,
        emergencyServices:
          inc.analysis.emergency_services || inc.analysis.emergencyServices,
      }
    : null;

  return {
    ...inc,
    contactNumber: inc.contact_number || inc.contactNumber,
    reporterName: inc.reporter_name || inc.reporterName,
    reportedBy: inc.reported_by || inc.reportedBy,
    priorityScore: inc.priority_score || inc.priorityScore,
    imageUrl: inc.image_url || inc.imageUrl,
    dispatchedUnits: inc.dispatched_units || inc.dispatchedUnits || [],
    createdAt: inc.created_at || inc.createdAt,
    updatedAt: inc.updated_at || inc.updatedAt,
    analysis: mappedAnalysis,
  };
};

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const refreshIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/incidents/`);
      if (!res.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const data = await res.json();
      setIncidents((data || []).map(mapIncident));
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshIncidents();
  }, [refreshIncidents]);

  const addIncident = useCallback(
    async (incidentData) => {
      const res = await fetch(`${API_URL}/api/incidents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: incidentData.title,
          type: incidentData.type,
          description: incidentData.description,
          location: incidentData.location,
          contact_number: incidentData.contactNumber,
          reported_by: user?.id || 'unknown',
          reporter_name: user?.name || 'Anonymous',
          image_url: incidentData.imageUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to create incident' }));
        throw new Error(err.detail || 'Failed to create incident');
      }

      const created = await res.json();
      setIncidents((prev) => [mapIncident(created), ...prev]);
      return mapIncident(created);
    },
    [user]
  );

  const updateStatus = useCallback(
    async (id, newStatus, dispatchedUnits = []) => {
      const res = await fetch(`${API_URL}/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          dispatched_units: dispatchedUnits,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to update status' }));
        throw new Error(err.detail || 'Failed to update status');
      }

      const updated = await res.json();
      setIncidents((prev) => prev.map((inc) => (inc.id === updated.id ? mapIncident(updated) : inc)));
      return updated;
    },
    []
  );

  const getIncident = useCallback(
    (id) => incidents.find((inc) => inc.id === id),
    [incidents]
  );

  const getUserIncidents = useCallback(
    () => incidents.filter((inc) => inc.reportedBy === user?.id),
    [incidents, user]
  );

  const getIncidentsByStatus = useCallback(
    (status) => incidents.filter((inc) => inc.status === status),
    [incidents]
  );

  const getIncidentsBySeverity = useCallback(
    (severity) => incidents.filter((inc) => inc.severity === severity),
    [incidents]
  );

  // ── Reactive analytics computed from live incident data ─────────────────────
  const getAnalytics = useCallback(() => {
    const total = incidents.length;
    const critical = incidents.filter((i) => i.severity === 'Critical').length;
    const resolved = incidents.filter(
      (i) => i.status === 'Resolved' || i.status === 'Closed'
    ).length;
    const pending = incidents.filter((i) => i.status === 'Pending').length;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const reportsPerDay = days.map((day) => ({ date: day, reports: 0 }));
    incidents.forEach((inc) => {
      const dayIndex = new Date(inc.createdAt).getDay();
      if (dayIndex >= 0 && dayIndex < 7) reportsPerDay[dayIndex].reports += 1;
    });
    const reorderedDays = [...reportsPerDay.slice(1), reportsPerDay[0]];

    const typeColors = {
      'Road Accident': '#3b82f6',
      Fire: '#ef4444',
      'Medical Emergency': '#22c55e',
      Flood: '#06b6d4',
      'Gas Leak': '#f59e0b',
      Earthquake: '#8b5cf6',
      'Building Collapse': '#a855f7',
      'Chemical Spill': '#ec4899',
    };
    const incidentsByType = Object.keys(typeColors)
      .map((type) => ({
        name: type,
        value: incidents.filter((i) => i.type === type).length,
        color: typeColors[type],
      }))
      .filter((item) => item.value > 0);

    const severityColors = {
      Critical: '#ef4444',
      High: '#f97316',
      Medium: '#eab308',
      Low: '#22c55e',
    };
    const severityDistribution = Object.keys(severityColors).map((sev) => ({
      name: sev,
      value: incidents.filter((i) => i.severity === sev).length,
      color: severityColors[sev],
    }));

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const monthlyTrend = months.map((m) => ({ month: m, incidents: 0, resolved: 0 }));
    incidents.forEach((inc) => {
      const monthIndex = new Date(inc.createdAt).getMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyTrend[monthIndex].incidents += 1;
        if (inc.status === 'Resolved' || inc.status === 'Closed') {
          monthlyTrend[monthIndex].resolved += 1;
        }
      }
    });

    return {
      totalReports: total,
      criticalReports: critical,
      resolvedReports: resolved,
      pendingReports: pending,
      avgResponseTime: '12 min',
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      reportsPerDay: reorderedDays,
      incidentsByType:
        incidentsByType.length > 0
          ? incidentsByType
          : [{ name: 'None', value: 1, color: '#64748b' }],
      severityDistribution,
      monthlyTrend: monthlyTrend.slice(0, new Date().getMonth() + 1),
    };
  }, [incidents]);

  const value = {
    incidents,
    isLoading,
    addIncident,
    updateStatus,
    getIncident,
    getUserIncidents,
    getIncidentsByStatus,
    getIncidentsBySeverity,
    refreshIncidents,
    analytics: getAnalytics(),
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidentContext() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidentContext must be used within an IncidentProvider');
  }
  return context;
}
