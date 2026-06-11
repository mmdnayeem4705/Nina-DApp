'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { payForAppointment, formatAddress } from '@/lib/ethereum';

interface Doctor {
  id: number;
  fullName: string;
  walletAddress: string;
  specialization: string;
  yearsOfExperience: number | null;
  consultationFee: string;
}

interface BookingFormData {
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  symptoms: string;
  allergies: string;
  bloodGroup: string;
  description: string;
}

export default function BookAppointment({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const { doctorId } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    symptoms: '',
    allergies: '',
    bloodGroup: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // Mock doctor data - in real scenario, fetch from API
        const mockDoctors: Record<string, Doctor> = {
          '1': {
            id: 1,
            fullName: 'Dr. John Smith',
            walletAddress: '0x1234567890123456789012345678901234567890',
            specialization: 'cardiology',
            yearsOfExperience: 10,
            consultationFee: '0.01',
          },
          '2': {
            id: 2,
            fullName: 'Dr. Jane Doe',
            walletAddress: '0x0987654321098765432109876543210987654321',
            specialization: 'neurology',
            yearsOfExperience: 8,
            consultationFee: '0.015',
          },
        };
        setDoctor(mockDoctors[doctorId] || null);
      } catch (err) {
        console.error('[v0] Error fetching doctor:', err);
        setError('Failed to load doctor information');
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!doctor || !user) {
      setError('Missing required information');
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      setError('Please select appointment date and time');
      return;
    }

    setSubmitting(true);

    try {
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.appointmentTime}`
      );

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: doctor.id,
          appointmentDate: appointmentDateTime.toISOString(),
          reason: formData.reason,
          symptoms: formData.symptoms,
          allergies: formData.allergies,
          bloodGroup: formData.bloodGroup,
          description: formData.description,
          consultationFee: doctor.consultationFee,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const data = await response.json();
      setAppointmentId(data.appointment.id);
      setShowPaymentModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!doctor || !appointmentId) {
      setError('Invalid appointment information');
      return;
    }

    setPaying(true);
    setError(null);

    try {
      const txHash = await payForAppointment(
        appointmentId.toString(),
        doctor.walletAddress,
        doctor.consultationFee
      );

      await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: true,
          paymentTxHash: txHash,
        }),
      });

      router.push(`/patient/appointment-confirmed/${appointmentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setShowPaymentModal(false);
    } finally {
      setPaying(false);
    }
  };

  if (isLoading || loadingDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor not found</p>
          <Link href="/patient/dashboard">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/patient/dashboard">
            <button className="text-blue-600 hover:text-blue-700 font-medium mb-4">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{doctor.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialization</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {doctor.specialization.replace(/_/g, ' ')}
                  </p>
                </div>
                {doctor.yearsOfExperience && (
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium text-gray-900">{doctor.yearsOfExperience} years</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="font-medium text-green-600 text-lg">{doctor.consultationFee} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wallet Address</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {formatAddress(doctor.walletAddress)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Time *
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Regular checkup, Follow-up visit"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe any symptoms you're experiencing"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  />
                </div>

                {/* Health Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Blood Group</option>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      placeholder="e.g., Penicillin, Peanuts"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your condition, pain location, or other relevant details"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && doctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Payment</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium text-gray-900">{doctor.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-medium text-green-600 text-lg">
                  {doctor.consultationFee} ETH
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Doctor Wallet:</span>
                <span className="font-mono text-xs text-gray-600">
                  {formatAddress(doctor.walletAddress)}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Confirm the payment in MetaMask on the Sepolia test network. The app uses a backup RPC
              to track confirmation if MetaMask&apos;s network is slow.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paying}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={paying}
                className="flex-1 py-2 px-4 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {paying ? 'Waiting for confirmation...' : 'Pay with MetaMask'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
