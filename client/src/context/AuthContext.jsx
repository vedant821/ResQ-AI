import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    id: 'admin-001',
    name: 'Admin Officer',
    email: 'admin@resqai.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9876543210',
    avatar: null,
  },
  {
    id: 'citizen-001',
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    password: 'user123',
    role: 'citizen',
    phone: '+91 9876543211',
    location: 'Mumbai, Maharashtra',
    avatar: null,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('resq_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('resq_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    const allUsers = [
      ...DEMO_USERS,
      ...JSON.parse(localStorage.getItem('resq_registered_users') || '[]'),
    ];

    const found = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('resq_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const register = async ({ name, email, password, phone, location }) => {
    await new Promise((r) => setTimeout(r, 800));

    const allUsers = [
      ...DEMO_USERS,
      ...JSON.parse(localStorage.getItem('resq_registered_users') || '[]'),
    ];

    if (allUsers.find((u) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: `citizen-${Date.now()}`,
      name,
      email,
      password,
      phone,
      location,
      role: 'citizen',
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    const registered = JSON.parse(
      localStorage.getItem('resq_registered_users') || '[]'
    );
    registered.push(newUser);
    localStorage.setItem('resq_registered_users', JSON.stringify(registered));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('resq_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resq_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
