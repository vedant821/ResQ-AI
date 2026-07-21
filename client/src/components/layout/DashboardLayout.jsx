import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import {
  Shield,
  LogOut,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  AlertTriangle,
  History,
  User,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const citizenLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report', path: '/report', icon: AlertTriangle },
    { name: 'History', path: '/history', icon: History },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  ];

  const mobileLinks = user?.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-dark-800/50">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-dark-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-emergency-500 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emergency-500 rounded-full animate-pulse" />
              </div>
              <span className="text-lg font-bold hidden sm:inline">
                <span className="text-white">ResQ</span>
                <span className="gradient-text"> AI</span>
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-dark-400 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emergency-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/30">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm text-dark-200 hidden sm:inline">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-dark-400 hover:text-emergency-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-16 bottom-0 w-64 glass border-r border-dark-800/50 p-4 space-y-1" onClick={e => e.stopPropagation()}>
            {mobileLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
