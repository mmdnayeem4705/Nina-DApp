'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChangeWalletModal } from '@/app/components/ChangeWalletModal';

export default function PatientSettings() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Account Information Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900 text-lg">{user.fullName || 'Not set'}</p>
              </div>
              <button className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm">Edit</button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900 text-lg">{user.email || 'Not set'}</p>
              </div>
              <button className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm">Edit</button>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <p className="text-gray-900 text-lg capitalize">{user.role}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center justify-between py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="text-gray-900 text-lg">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Management Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet Management</h2>

          <div className="space-y-6">
            {/* Current Wallet */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connected MetaMask Wallet
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-mono break-all">
                    {user.walletAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    This is the MetaMask wallet address connected to your account
                  </p>
                </div>
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V9m-10-6v4m0 0a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </div>
            </div>

            {/* Change Wallet Button */}
            <button
              onClick={() => setShowWalletModal(true)}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Change MetaMask Wallet
            </button>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You can change your connected MetaMask wallet anytime. Your account data will be preserved, but you'll need to use the new wallet for future transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security</h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Security Status:</strong> Your account is secured with MetaMask wallet signature verification. No password is stored on our servers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-3">Not currently enabled</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Enable 2FA
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Session Management</h3>
                <p className="text-sm text-gray-600 mb-3">1 active session</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage Sessions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-600">
                  Get notified about appointment updates
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMS Notifications
                </label>
                <p className="text-sm text-gray-600">
                  Get text messages for important updates
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Reminders
                </label>
                <p className="text-sm text-gray-600">
                  Remind me 24 hours before appointments
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            <button className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium border border-red-300">
              Delete Account
            </button>

            <p className="text-sm text-gray-600">
              Deleting your account is permanent and cannot be undone. All your data will be erased.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 pb-8">
          <Link href="/patient/dashboard">
            <button className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Change Wallet Modal */}
      {user && (
        <ChangeWalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          currentWallet={user.walletAddress}
        />
      )}
    </div>
  );
}
