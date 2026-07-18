const severityStyles = {
  Critical: 'severity-critical',
  High: 'severity-high',
  Medium: 'severity-medium',
  Low: 'severity-low',
};

const statusStyles = {
  Pending: 'status-pending',
  Assigned: 'status-assigned',
  'In Progress': 'status-inprogress',
  Resolved: 'status-resolved',
  Closed: 'status-closed',
};

export default function Badge({ children, variant = 'severity', type, className = '' }) {
  const styles = variant === 'status' ? statusStyles : severityStyles;
  const style = styles[type] || 'bg-dark-700 text-dark-300 border border-dark-600';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style} ${className}`}>
      {children || type}
    </span>
  );
}
