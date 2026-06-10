'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrganDonationForm {
  organs: string[];
  bloodType: string;
  medicalConditions: string;
  familyConsent: boolean;
}

const availableOrgans = [
  'Heart',
  'Lungs',
  'Liver',
  'Kidneys',
  'Pancreas',
  'Eyes',
  'Skin',
  'Bone Marrow',
  'Bone',
  'Tissue',
];

export default function OrganDonation() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<OrganDonationForm>({
    organs: [],
    bloodType: '',
    medicalConditions: '',
    familyConsent: false,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchForms = async () => {
      try {
        const response = await fetch(`/api/organ-donation?patientId=${user.id}`);
        const data = await response.json();
        setForms(data.forms || []);
      } catch (err) {
        console.error('[v0] Error fetching organ donation forms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user]);

  const handleOrganToggle = (organ: string) => {
    setFormData((prev) => ({
      ...prev,
      organs: prev.organs.includes(organ)
        ? prev.organs.filter((o) => o !== organ)
        : [...prev.organs, organ],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.organs.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select at least one organ',
      });
      return;
    }

    if (!formData.bloodType) {
      setMessage({
        type: 'error',
        text: 'Please select your blood type',
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/organ-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user?.id,
          doctorId: 1, // This would be the selected doctor
          organs: formData.organs,
          bloodType: formData.bloodType,
          medicalConditions: formData.medicalConditions,
          familyConsent: formData.familyConsent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit organ donation form');
      }

      setMessage({
        type: 'success',
        text: 'Organ donation form submitted successfully!',
      });

      setShowForm(false);
      setFormData({
        organs: [],
        bloodType: '',
        medicalConditions: '',
        familyConsent: false,
      });

      // Refresh the forms list
      const updatedResponse = await fetch(`/api/organ-donation?patientId=${user?.id}`);
      const data = await updatedResponse.json();
      setForms(data.forms || []);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to submit form',
      });
    } finally {
      setSubmitting(false);
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
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/patient/dashboard">
              <button className="text-blue-600 hover:text-blue-700 font-medium mb-4">
                ← Back to Dashboard
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Organ Donation Registration</h1>
            <p className="text-gray-600 mt-1">Register your organ donation preferences</p>
          </div>
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

        {/* Existing Forms */}
        {!loading && forms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Organ Donation Forms</h2>
            <div className="space-y-4">
              {forms.map((form) => (
                <div key={form.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Form #{form.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Submitted on {new Date(form.dateOfSubmission).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        form.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {form.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Organs</p>
                      <p className="font-medium text-gray-900">
                        {JSON.parse(form.organs || '[]').join(', ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Type</p>
                      <p className="font-medium text-gray-900">{form.bloodType}</p>
                    </div>
                  </div>

                  {form.medicalConditions && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Medical Conditions</p>
                      <p className="text-gray-900">{form.medicalConditions}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition">
                      Edit
                    </button>
                    {form.status === 'active' && (
                      <button className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition">
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Form Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 px-6 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
          >
            Register Organ Donation
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Organ Donation Form</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organs Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Organs You Wish to Donate *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableOrgans.map((organ) => (
                    <label key={organ} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.organs.includes(organ)}
                        onChange={() => handleOrganToggle(organ)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">{organ}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type *
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Blood Type</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions or Special Notes
                </label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="Any medical conditions or special notes relevant to organ donation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
                />
              </div>

              {/* Family Consent */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="familyConsent"
                  checked={formData.familyConsent}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <label className="ml-3 text-gray-700">
                  I have discussed this decision with my family members and have their consent
                </label>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> This form registers your intent to donate organs. This is not legally binding and can be modified or withdrawn at any time. Please ensure your family members are aware of your decision.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
