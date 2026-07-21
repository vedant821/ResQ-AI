import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import {
  Shield,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  AlertTriangle,
  History,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const mobileLinks = user?.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Mobile Top Header (Hidden on Desktop) */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            className="p-2 -ml-2 text-dark-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <Shield size={14} className="text-primary-500" />
            ResQ AI
          </span>
        </div>
        <button
          onClick={logout}
          className="p-2 text-dark-400 hover:text-emergency-400 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Mobile Sidebar Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className="absolute left-0 top-14 bottom-0 w-64 bg-dark-900 border-r border-dark-700 p-4 space-y-1" 
            onClick={e => e.stopPropagation()}
          >
            {mobileLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800'
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

      {/* Main Content Area */}
      <main className="pt-14 lg:pt-0 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
