'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  reason: string;
  symptoms: string;
  allergies: string;
  bloodGroup: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  consultationFee: string;
  paymentStatus: boolean;
  paymentTxHash?: string;
  createdAt: string;
}

export default function AppointmentDetail({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        const data = await response.json();
        setAppointment(data.appointment);
      } catch (err) {
        console.error('[v0] Error fetching appointment:', err);
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      const data = await response.json();
      setAppointment(data.appointment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Appointment not found</p>
          <Link href="/doctor/dashboard">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Patient Appointment #{appointment.id}
              </h2>
              <p className="text-gray-600">Patient ID: {appointment.patientId}</p>
            </div>
            <span
              className={`px-4 py-2 rounded font-medium text-sm ${
                statusColors[appointment.status]
              }`}
            >
              {appointment.status}
            </span>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date & Time</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                {new Date(appointment.appointmentDate).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
              <p className="text-lg font-medium text-green-600">
                {appointment.consultationFee} ETH
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  appointment.paymentStatus
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {appointment.paymentStatus ? 'Paid' : 'Pending Payment'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Reason for Visit</p>
              <p className="font-medium text-gray-900">
                {appointment.reason || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Patient Health Information */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Health Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                <p className="font-medium text-gray-900">
                  {appointment.bloodGroup || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Allergies</p>
                <p className="font-medium text-gray-900">
                  {appointment.allergies || 'None reported'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Symptoms</p>
              <div className="bg-gray-50 rounded p-3 min-h-[60px]">
                <p className="text-gray-900">
                  {appointment.symptoms || 'No symptoms described'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Description</h3>
            <div className="bg-gray-50 rounded p-4 min-h-[80px]">
              <p className="text-gray-900 leading-relaxed">
                {appointment.description || 'No additional description provided'}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          {appointment.paymentTxHash && (
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
                <p className="font-mono text-xs text-gray-900 break-all">
                  {appointment.paymentTxHash}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {appointment.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={updating}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {updating ? 'Processing...' : 'Approve Appointment'}
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={updating}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {updating ? 'Processing...' : 'Reject Appointment'}
              </button>
            </div>
          )}

          {appointment.status === 'approved' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={updating}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {updating ? 'Processing...' : 'Mark as Completed'}
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={updating}
                className="flex-1 py-3 px-4 bg-gray-600 text-white rounded font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {updating ? 'Processing...' : 'Cancel Appointment'}
              </button>
            </div>
          )}

          {appointment.status !== 'pending' &&
            appointment.status !== 'approved' &&
            appointment.status !== 'rejected' && (
              <p className="text-center text-gray-600 p-4 bg-gray-50 rounded">
                This appointment has already been {appointment.status}.
              </p>
            )}
        </div>
      </main>
    </div>
  );
}
