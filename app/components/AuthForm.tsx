'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  requestAccount,
  isMetaMaskAvailable,
  signMessage,
  formatAddress,
} from '@/lib/ethereum';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');
  const [fullName, setFullName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleConnectWallet = async () => {
    if (!isMetaMaskAvailable()) {
      setLocalError('MetaMask is not installed. Please install it first.');
      return;
    }

    setLoading(true);
    setLocalError(null);

    try {
      const address = await requestAccount();
      setWalletAddress(address);
      setShowNameInput(!isLogin);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Failed to connect wallet'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!walletAddress) {
      setLocalError('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      const message = isLogin
        ? `Sign this message to login to Doctor Appointment Booking System\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`
        : `Sign this message to register to Doctor Appointment Booking System\nWallet: ${walletAddress}\nRole: ${selectedRole}\nTimestamp: ${Date.now()}`;

      const signature = await signMessage(message);

      if (isLogin) {
        await login(walletAddress, message, signature);
      } else {
        if (!fullName.trim()) {
          setLocalError('Please enter your full name');
          setLoading(false);
          return;
        }
        await register(walletAddress, selectedRole, fullName, message, signature);
      }

      onSuccess?.();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Authentication failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-8 rounded-full bg-primary"></div>
          <h3 className="text-xl font-black tracking-tight text-foreground uppercase">
            Nina Hospital Portal
          </h3>
        </div>
        <p className="text-muted-foreground font-medium">
          {isLogin ? 'Sign in to your account' : 'Create a new secure account'}
        </p>
      </div>

      {localError && (
        <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive shadow-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="font-medium">{localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Authentication Method
          </label>
          {walletAddress ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary shadow-inner flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="font-bold">Wallet Connected</p>
                  <p className="text-xs opacity-70 font-mono tracking-tight">{formatAddress(walletAddress)}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setWalletAddress('')}
                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors opacity-0 group-hover:opacity-100"
                title="Disconnect"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={loading}
              className="group w-full relative overflow-hidden rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span>{loading ? 'Connecting...' : 'Connect MetaMask Wallet'}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          )}
        </div>

        {!isLogin && walletAddress && (
          <div className="space-y-2 animate-fade-in-up">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Personal Information
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-border bg-input/50 pl-12 pr-4 py-4 text-foreground font-medium placeholder:text-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:ring-primary/20 focus:ring-4 focus:outline-none focus:bg-background"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {!isLogin && walletAddress && (
          <div className="space-y-3 animate-fade-in-up">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Select Your Role
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              {['patient', 'doctor'].map((role) => (
                <label
                  key={role}
                  className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                    selectedRole === role
                      ? 'border-primary bg-primary/5 text-primary shadow-md shadow-primary/5'
                      : 'border-border bg-input/50 text-foreground hover:border-primary/50'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedRole === role ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {role === 'patient' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a2 2 0 01-1.091.217l-1.612-.161a2 2 0 01-1.022-.547l-2.387-2.387a2 2 0 010-2.828l2.387-2.387a2 2 0 012.828 0l2.387 2.387a2 2 0 01.547 1.022l.161 1.612a2 2 0 01-.217 1.091l-.309.618a6 6 0 00-.517 3.86l.477 2.387a2 2 0 00.547 1.022l2.387 2.387a2 2 0 002.828 0l2.387-2.387a2 2 0 000-2.828l-2.387-2.387z" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold capitalize">{role}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Access Portal</span>
                  </div>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as 'patient' | 'doctor')}
                    disabled={loading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {selectedRole === role && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {walletAddress && (
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-foreground text-background px-6 py-4 text-sm font-black uppercase tracking-widest shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Processing...' : isLogin ? 'Access System' : 'Create Account'}
          </button>
        )}
      </form>

      <div className="mt-8 pt-8 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setWalletAddress('');
              setFullName('');
              setShowNameInput(false);
              setLocalError(null);
            }}
            className="ml-2 font-black text-primary transition-all hover:tracking-wider cursor-pointer"
          >
            {isLogin ? 'REGISTER' : 'SIGN IN'}
          </button>
        </p>
      </div>
    </div>
  );
}
