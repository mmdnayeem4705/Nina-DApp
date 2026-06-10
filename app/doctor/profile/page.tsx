'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DoctorProfile {
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualifications: string;
  consultationFee: string;
  bio: string;
  isVerified: boolean;
}

const specialties = [
  'cardiology',
  'neurology',
  'orthopedics',
  'dermatology',
  'ophthalmology',
  'otolaryngology',
  'gastroenterology',
  'pulmonology',
  'nephrology',
  'rheumatology',
  'endocrinology',
  'psychiatry',
  'general_medicine',
  'surgery',
  'pediatrics',
  'obstetrics_gynecology',
];

export default function DoctorProfile() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<DoctorProfile>({
    specialization: 'general_medicine',
    licenseNumber: '',
    yearsOfExperience: 0,
    qualifications: '',
    consultationFee: '0.01',
    bio: '',
    isVerified: false,
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // In a real application, this would save to the database
      // For now, we'll just update the local state
      setEditing(false);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/doctor/dashboard">
            <button className="text-blue-600 hover:text-blue-700 font-medium mb-4">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-400'
                : 'bg-red-100 text-red-700 border border-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {/* Account Info */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.fullName || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={user.walletAddress}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2 rounded font-medium transition ${
                  editing
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <select
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600"
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Number *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="e.g., MED-12345-XYZ"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={profile.yearsOfExperience}
                  onChange={handleInputChange}
                  disabled={!editing}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications & Education
                </label>
                <textarea
                  name="qualifications"
                  value={profile.qualifications}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="e.g., MBBS, MD Cardiology, Fellowship in..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 h-20"
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee (ETH) *
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={profile.consultationFee}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="Write a brief bio about yourself, your experience, and specializations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 h-24"
                />
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      profile.isVerified ? 'bg-green-600' : 'bg-gray-400'
                    }`}
                  ></div>
                  <span className="text-gray-900">
                    {profile.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Your profile will be verified by the admin after submission.
                </p>
              </div>
            </div>

            {editing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
