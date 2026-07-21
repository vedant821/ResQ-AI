import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Shield, Menu, X, LogOut, User, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Testimonials', path: '/#testimonials' },
    { name: 'FAQ', path: '/#faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:px-6 lg:px-8 pointer-events-none">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-5xl pointer-events-auto transition-all duration-500 rounded-full ${
            isScrolled
              ? 'glass px-6 py-2 shadow-xl shadow-slate-200/50 border-dark-700 bg-white/70 backdrop-blur-md'
              : 'px-4 py-4 bg-transparent border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Shield size={18} className="text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-500 rounded-full animate-ping" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-dark-50">ResQ</span>
                <span className="text-primary-600">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation Link Capsules */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-dark-800 border border-dark-700">
              {navLinks.map((link) => {
                const isActive = location.hash === link.path.replace('/', '') || (location.pathname === '/' && link.path === '/');
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className="relative px-4 py-1.5 text-xs font-semibold tracking-wide text-dark-300 hover:text-dark-50 transition-colors duration-300 rounded-full"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white shadow-sm rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 text-xs font-semibold text-dark-200 hover:text-dark-50 px-3 py-1.5 rounded-lg hover:bg-dark-800 transition-all"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-xs font-semibold text-dark-300 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-dark-800"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-xs font-semibold text-dark-300 hover:text-primary-600 px-4 py-2 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-xs py-2 px-5 rounded-full flex items-center gap-2 group shadow-none">
                    Register
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              className="md:hidden p-2 text-dark-300 hover:text-dark-50 hover:bg-dark-800 rounded-full transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Screen-covering Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-dark-50">ResQ</span>
                <span className="text-primary-600">AI</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile links centered */}
            <div className="flex flex-col gap-6 text-center my-auto">
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  key={link.name}
                  href={link.path}
                  className="text-2xl font-bold text-dark-50 hover:text-primary-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="btn-primary text-center py-3.5 rounded-xl text-sm font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center py-3 text-sm font-semibold text-red-500 bg-dark-800 rounded-xl hover:bg-dark-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="w-full text-center py-3.5 text-sm font-semibold text-dark-50 bg-white border border-dark-700 rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center py-3.5 rounded-xl text-sm font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
