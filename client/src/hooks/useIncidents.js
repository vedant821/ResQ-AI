import { useState, useEffect, useCallback } from 'react';
import { MOCK_INCIDENTS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

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

function saveIncidents(incidents) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
}

export function useIncidents() {
  const [incidents, setIncidents] = useState(loadIncidents);
  const { user } = useAuth();

  useEffect(() => {
    saveIncidents(incidents);
  }, [incidents]);

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
    setIncidents((prev) => [newIncident, ...prev]);
    return newIncident;
  }, [user]);

  const updateStatus = useCallback((id, newStatus) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? { ...inc, status: newStatus, updatedAt: new Date().toISOString() }
          : inc
      )
    );
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

  return {
    incidents,
    addIncident,
    updateStatus,
    getIncident,
    getUserIncidents,
    getIncidentsByStatus,
    getIncidentsBySeverity,
  };
}
