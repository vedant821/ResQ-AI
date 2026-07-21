import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  History,
  Shield,
  LogOut,
  Bell,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-dark-700 hidden lg:flex flex-col justify-between overflow-y-auto z-50">
      {/* Top half */}
      <div className="p-4 space-y-5">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 px-3 py-2 group">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-emergency-500 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Shield size={16} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emergency-500 rounded-full animate-ping" />
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="text-white">ResQ</span>
            <span className="text-primary-500"> AI</span>
          </span>
        </Link>

        {/* User Profile info */}
        <div className="px-3 py-3 rounded-xl bg-dark-800 border border-dark-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-dark-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-dark-400 uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Emergency Numbers */}
        <div className="px-3 py-3.5 rounded-xl bg-emergency-500/5 border border-emergency-500/10">
          <p className="text-[10px] font-bold text-emergency-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield size={10} />
            Emergency Contacts
          </p>
          <div className="space-y-1 text-[10px] text-dark-300">
            <p>🚔 Police: <span className="text-white font-medium">100</span></p>
            <p>🔥 Fire: <span className="text-white font-medium">101</span></p>
            <p>🚑 Ambulance: <span className="text-white font-medium">108</span></p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions inside Sidebar */}
      <div className="p-4 border-t border-dark-700/60 bg-dark-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="relative p-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white transition-colors">
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emergency-500 rounded-full" />
          </button>
          <span className="text-[10px] text-dark-400 font-mono">ResQ Console</span>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-lg bg-dark-800/50 text-dark-400 hover:text-emergency-400 hover:bg-emergency-500/10 transition-colors"
          title="Logout Session"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
