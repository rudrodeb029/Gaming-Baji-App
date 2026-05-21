import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAdminDashboard } from './AdminDashboardContext';

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Match Join' | 'Winning';
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface BalanceContextType {
  balance: number;
  transactions: Transaction[];
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  deductBalance: (amount: number, type?: Transaction['type']) => boolean;
  addBalance: (amount: number, type?: Transaction['type']) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const { adminUsers, updateUserBalance, paymentRequests, withdrawalRequests } = useAdminDashboard();
  const [generatedUserId] = useState(() => localStorage.getItem('generatedUserId') || 'USER123');
  
  // Find current user in admin dashboard state
  const currentUserData = adminUsers.find(u => u.id === generatedUserId);
  
  // Derive balance directly from source of truth
  const balance = currentUserData?.balance || 0;

  // Derive transactions from requests for better sync
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'Deposit', amount: 500, date: 'Today, 10:30 AM', status: 'Completed' },
    { id: '2', type: 'Match Join', amount: -50, date: 'Yesterday, 08:15 PM', status: 'Completed' },
    { id: '3', type: 'Winning', amount: 200, date: '2 days ago', status: 'Completed' },
  ]);

  const addTransaction = (type: Transaction['type'], amount: number, status: Transaction['status'] = 'Completed') => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      date: 'Just now',
      status
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deductBalance = (amount: number, type: Transaction['type'] = 'Match Join') => {
    if (balance >= amount) {
      const newBalance = balance - amount;
      updateUserBalance(generatedUserId, newBalance);
      addTransaction(type, -amount);
      return true;
    }
    return false;
  };

  const addBalance = (amount: number, type: Transaction['type'] = 'Deposit') => {
    const newBalance = balance + amount;
    updateUserBalance(generatedUserId, newBalance);
    addTransaction(type, amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, transactions, setBalance: () => {}, deductBalance, addBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

