import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const IncidentContext = createContext(null);
const STORAGE_KEY = 'resq_incidents';
const API_URL = '/api';

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Helper to load fallback local storage data
  const loadLocalFallback = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }, []);

  // Fetch all incidents from FastAPI backend, fallback to localStorage
  const refreshIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/incidents/`);
      if (res.ok) {
        const data = await res.json();
        // Map backend snake_case properties to frontend camelCase if needed
        const mapped = data.map(inc => ({
          ...inc,
          contactNumber: inc.contact_number || inc.contactNumber,
          reporterName: inc.reporter_name || inc.reporterName,
          reportedBy: inc.reported_by || inc.reportedBy,
          priorityScore: inc.priority_score || inc.priorityScore,
        }));
        setIncidents(mapped);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      } else {
        setIncidents(loadLocalFallback());
      }
    } catch (err) {
      console.warn("Backend offline, falling back to local storage:", err);
      setIncidents(loadLocalFallback());
    } finally {
      setIsLoading(false);
    }
  }, [loadLocalFallback]);

  // Load initially
  useEffect(() => {
    refreshIncidents();
  }, [refreshIncidents]);

  const addIncident = useCallback(async (incidentData) => {
    const tempId = `INC-${String(Date.now()).slice(-6)}`;
    const newIncident = {
      ...incidentData,
      id: tempId,
      status: 'Pending',
      reportedBy: user?.id || 'unknown',
      reporterName: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try posting to backend
    try {
      const res = await fetch(`${API_URL}/incidents/`, {
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
        }),
      });

      if (res.ok) {
        const created = await res.json();
        const mappedCreated = {
          ...created,
          contactNumber: created.contact_number,
          reporterName: created.reporter_name,
          reportedBy: created.reported_by,
          priorityScore: created.priority_score,
        };
        setIncidents((prev) => {
          const updated = [mappedCreated, ...prev];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return mappedCreated;
      }
    } catch (err) {
      console.warn("Post to backend failed, saving locally:", err);
    }

    // Local fallback save
    setIncidents((prev) => {
      const updated = [newIncident, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return newIncident;
  }, [user]);

  const updateStatus = useCallback(async (id, newStatus) => {
    // Try patching backend
    try {
      const res = await fetch(`${API_URL}/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await refreshIncidents();
        return;
      }
    } catch (err) {
      console.warn("Patch status failed, updating locally:", err);
    }

    // Local fallback update
    setIncidents((prev) => {
      const updated = prev.map((inc) =>
        inc.id === id
          ? { ...inc, status: newStatus, updatedAt: new Date().toISOString() }
          : inc
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [refreshIncidents]);

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

  // Generate reactive real-time analytics data
  const getAnalytics = useCallback(() => {
    const total = incidents.length;
    const critical = incidents.filter((i) => i.severity === 'Critical').length;
    const resolved = incidents.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;
    const pending = incidents.filter((i) => i.status === 'Pending').length;

    // Reports per day grouping
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const reportsPerDay = days.map((day) => ({ date: day, reports: 0 }));
    incidents.forEach((inc) => {
      const dayIndex = new Date(inc.createdAt).getDay();
      if (dayIndex >= 0 && dayIndex < 7) {
        reportsPerDay[dayIndex].reports += 1;
      }
    });
    // Reorder Mon to Sun
    const reorderedDays = [...reportsPerDay.slice(1), reportsPerDay[0]];

    // Incident types distribution
    const typeColors = {
      'Road Accident': '#3b82f6',
      'Fire': '#ef4444',
      'Medical Emergency': '#22c55e',
      'Flood': '#06b6d4',
      'Gas Leak': '#f59e0b',
      'Earthquake': '#8b5cf6',
      'Building Collapse': '#a855f7',
      'Chemical Spill': '#ec4899',
    };
    const incidentsByType = Object.keys(typeColors).map((type) => ({
      name: type,
      value: incidents.filter((i) => i.type === type).length,
      color: typeColors[type],
    })).filter(item => item.value > 0);

    // Severity distribution
    const severityColors = {
      'Critical': '#ef4444',
      'High': '#f97316',
      'Medium': '#eab308',
      'Low': '#22c55e',
    };
    const severityDistribution = Object.keys(severityColors).map((sev) => ({
      name: sev,
      value: incidents.filter((i) => i.severity === sev).length,
      color: severityColors[sev],
    }));

    // Monthly trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
      incidentsByType: incidentsByType.length > 0 ? incidentsByType : [{ name: 'None', value: 1, color: '#64748b' }],
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
