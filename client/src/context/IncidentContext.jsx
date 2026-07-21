import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_INCIDENTS } from '../services/mockData';
import { useAuth } from './AuthContext';

const IncidentContext = createContext(null);
const STORAGE_KEY = 'resq_incidents';

function loadIncidents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...MOCK_INCIDENTS];
    }
  }
  return [...MOCK_INCIDENTS];
}

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(loadIncidents);
  const { user } = useAuth();

  const addIncident = useCallback((incident) => {
    const newIncident = {
      ...incident,
      id: `INC-${String(Date.now()).slice(-6)}`,
      status: 'Pending',
      reportedBy: user?.id || 'unknown',
      reporterName: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setIncidents((prev) => {
      const updated = [newIncident, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    
    return newIncident;
  }, [user]);

  const updateStatus = useCallback((id, newStatus) => {
    setIncidents((prev) => {
      const updated = prev.map((inc) =>
        inc.id === id
          ? { ...inc, status: newStatus, updatedAt: new Date().toISOString() }
          : inc
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

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

  const value = {
    incidents,
    addIncident,
    updateStatus,
    getIncident,
    getUserIncidents,
    getIncidentsByStatus,
    getIncidentsBySeverity,
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
