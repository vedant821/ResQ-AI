import { useIncidentContext } from '../context/IncidentContext';

export function useIncidents() {
  return useIncidentContext();
}

