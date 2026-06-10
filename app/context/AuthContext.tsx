'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCurrentAccount } from '@/lib/ethereum';

export interface User {
  id: number;
  walletAddress: string;
  role: 'patient' | 'doctor' | 'admin';
  fullName: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (walletAddress: string, message: string, signature: string) => Promise<void>;
  register: (
    walletAddress: string,
    role: 'patient' | 'doctor',
    fullName: string,
    message: string,
    signature: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  changeWallet: (oldWalletAddress: string, newWalletAddress: string, message: string, signature: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const account = await getCurrentAccount();
        if (account) {
          // Try to load user from session storage
          const storedUser = sessionStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('[v0] Auth check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (walletAddress: string, message: string, signature: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            message,
            signature,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }

        const data = await response.json();
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (
      walletAddress: string,
      role: 'patient' | 'doctor',
      fullName: string,
      message: string,
      signature: string
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            role,
            fullName,
            message,
            signature,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Registration failed');
        }

        const data = await response.json();
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setUser(null);
    sessionStorage.removeItem('user');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const changeWallet = useCallback(
    async (oldWalletAddress: string, newWalletAddress: string, message: string, signature: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/change-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldWalletAddress,
            newWalletAddress,
            message,
            signature,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to change wallet');
        }

        const data = await response.json();
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to change wallet';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        clearError,
        changeWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
