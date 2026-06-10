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
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Nina Hospital Portal
        </h1>
        <p className="text-muted-foreground">
          {isLogin ? 'Sign in to your account' : 'Create a new secure account'}
        </p>
      </div>

      {localError && (
        <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-100 shadow-sm">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            MetaMask Wallet
          </label>
          {walletAddress ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-100 shadow-inner">
              <p className="font-semibold">Connected</p>
              <p className="mt-1 opacity-90">{formatAddress(walletAddress)}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={loading}
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-0.5 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </button>
          )}
        </div>

        {!isLogin && walletAddress && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-primary/40 focus:ring-4 focus:outline-none"
              disabled={loading}
            />
          </div>
        )}

        {!isLogin && walletAddress && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              I am a:
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {['patient', 'doctor'].map((role) => (
                <label
                  key={role}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition duration-300 ${
                    selectedRole === role
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-input text-foreground hover:border-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as 'patient' | 'doctor')}
                    disabled={loading}
                    className="h-4 w-4 text-primary accent-primary"
                  />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {walletAddress && (
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-foreground text-background px-4 py-3 text-sm font-semibold shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
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
            className="ml-2 font-semibold text-primary transition hover:underline cursor-pointer"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
