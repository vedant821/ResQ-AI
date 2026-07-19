import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  History,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Users,
  Activity,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const citizenLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Emergency', path: '/report', icon: AlertTriangle },
    { name: 'My Reports', path: '/history', icon: History },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  ];

  const links = user?.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-dark-800/50 hidden lg:block overflow-y-auto">
      <div className="p-4 space-y-1">
        {/* User info */}
        <div className="px-3 py-4 mb-4 rounded-xl bg-dark-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}

        {/* Emergency Numbers */}
        <div className="mt-8 px-3 py-4 rounded-xl bg-emergency-500/5 border border-emergency-500/10">
          <p className="text-xs font-semibold text-emergency-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield size={12} />
            Emergency Numbers
          </p>
          <div className="space-y-1.5 text-xs text-dark-400">
            <p>🚔 Police: <span className="text-white">100</span></p>
            <p>🔥 Fire: <span className="text-white">101</span></p>
            <p>🚑 Ambulance: <span className="text-white">108</span></p>
            <p>🆘 Universal: <span className="text-white">112</span></p>
          </div>
        </div>
      </div>
    </aside>
  );
}
