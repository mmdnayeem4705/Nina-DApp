'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { signMessage } from '@/lib/ethereum';

interface ChangeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallet: string;
}

export function ChangeWalletModal({ isOpen, onClose, currentWallet }: ChangeWalletModalProps) {
  const { changeWallet, error: contextError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'connect' | 'confirm' | 'success'>('connect');
  const [newWalletAddress, setNewWalletAddress] = useState('');

  const handleConnect = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Request account from MetaMask
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      const selectedAccount = accounts[0].toLowerCase();
      setNewWalletAddress(selectedAccount);
      setStep('confirm');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMsg);
      console.error('[v0] Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!newWalletAddress) {
        throw new Error('No wallet address selected');
      }

      // Generate a message to sign
      const message = `Change wallet from ${currentWallet} to ${newWalletAddress}\nTimestamp: ${new Date().toISOString()}`;

      // Sign with new wallet
      const signature = await signMessage(message, newWalletAddress);

      // Call changeWallet
      await changeWallet(currentWallet, newWalletAddress, message, signature);

      setSuccess(true);
      setStep('success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change wallet';
      setError(errorMsg);
      console.error('[v0] Wallet change error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setSuccess(false);
      setStep('connect');
      setNewWalletAddress('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Change Wallet Address</h2>

        {step === 'connect' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                <strong>Current Wallet:</strong>
                <br />
                {currentWallet}
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Click below to connect your new MetaMask wallet. You'll need to sign a message to confirm the change.
            </p>

            {(error || contextError) && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">{error || contextError}</p>
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isLoading ? 'Connecting...' : 'Connect New Wallet'}
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-xs text-gray-600 mb-2">Current Wallet:</p>
              <p className="text-sm font-mono text-gray-900 break-all mb-4">{currentWallet}</p>

              <p className="text-xs text-gray-600 mb-2">New Wallet:</p>
              <p className="text-sm font-mono text-gray-900 break-all">{newWalletAddress}</p>
            </div>

            <p className="text-sm text-gray-600">
              Click "Confirm Change" to sign the transaction with your new wallet and complete the process.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('connect')}
                disabled={isLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded transition"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
              >
                {isLoading ? 'Confirming...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-green-800 font-semibold">Wallet Changed Successfully!</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-xs text-gray-600 mb-1">New Wallet Address:</p>
              <p className="text-sm font-mono text-gray-900 break-all">{newWalletAddress}</p>
            </div>

            <p className="text-sm text-gray-600">
              Your account is now linked to the new wallet address. You can use it to log in next time.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Done
            </button>
          </div>
        )}

        {/* Close button */}
        {step !== 'success' && (
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
