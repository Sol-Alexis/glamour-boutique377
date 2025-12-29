import React, { createContext, useContext, useState, useEffect } from 'react';

// Added password to the User interface
interface User {
  name: string;
  email: string;
  password?: string; 
  role?: string; // Optional: in case you have an admin role
}

interface AuthContextType {
  user: User | null;
  isDarkMode: boolean;
  login: (email: string, password: string) => boolean; // Changed to take credentials
  logout: () => void;
  updateUser: (newName: string) => void;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // --- UPDATED LOGIN LOGIC ---
  const login = (email: string, password: string): boolean => {
    // 1. Get all registered users (saved during Signup)
    const storedUsers = JSON.parse(localStorage.getItem('glamour_users') || '[]');

    // 2. Look for a user that matches both Email and Password
    const foundUser = storedUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // If match is found, log them in
      const sessionUser = { name: foundUser.name || foundUser.firstName, email: foundUser.email };
      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      return true; // Success
    } else {
      return false; // Failed
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (newName: string) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{ user, isDarkMode, login, logout, updateUser, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};