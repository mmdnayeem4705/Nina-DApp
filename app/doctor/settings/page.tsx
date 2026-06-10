'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChangeWalletModal } from '@/app/components/ChangeWalletModal';

export default function DoctorSettings() {
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
            <h1 className="text-3xl font-bold text-gray-900">Doctor Settings</h1>
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
        {/* Professional Information Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet & Payments</h2>

          <div className="space-y-6">
            {/* Current Wallet */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MetaMask Wallet (Receives Payments)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-mono break-all">
                    {user.walletAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Patient payments will be sent to this wallet address
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
                <strong>Important:</strong> Changing your wallet will direct all future patient payments to the new wallet address. Previous transactions cannot be reversed.
              </p>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Total Earned</h3>
                <p className="text-2xl font-bold text-green-600">0 ETH</p>
                <p className="text-sm text-gray-600">From all appointments</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Pending Balance</h3>
                <p className="text-2xl font-bold text-orange-600">0 ETH</p>
                <p className="text-sm text-gray-600">Awaiting payment confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security</h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Security Status:</strong> Your account is secured with MetaMask wallet signature verification. Only you can authorize payments from your wallet.
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
                  Appointment Notifications
                </label>
                <p className="text-sm text-gray-600">
                  Get notified when patients book appointments
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Notifications
                </label>
                <p className="text-sm text-gray-600">
                  Get notified when payments are received
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Digest
                </label>
                <p className="text-sm text-gray-600">
                  Weekly summary of appointments and earnings
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4" />
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
              Deleting your account is permanent. All your appointment history and patient data will be archived but not deleted.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 pb-8">
          <Link href="/doctor/dashboard">
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
