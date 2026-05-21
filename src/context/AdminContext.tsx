import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const saved = localStorage.getItem('isAdminMode');
    return saved === 'true';
  });

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const next = !prev;
      localStorage.setItem('isAdminMode', next.toString());
      return next;
    });
  };

  return (
    <AdminContext.Provider value={{ isAdminMode, toggleAdminMode }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
