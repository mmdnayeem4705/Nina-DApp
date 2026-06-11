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
}

export default function AppointmentConfirmed({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked!</h1>
          <p className="text-gray-600 mb-8">
            Your appointment has been successfully booked and payment has been processed.
          </p>

          {/* Appointment Details */}
          {appointment && (
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment ID:</span>
                  <span className="font-medium text-gray-900">#{appointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor ID:</span>
                  <span className="font-medium text-gray-900">{appointment.doctorId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-medium text-green-600">{appointment.consultationFee} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    Paid
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment Status:</span>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                    Pending
                  </span>
                </div>
              </div>

              {appointment.paymentTxHash && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
                  <p className="font-mono text-xs text-gray-600 break-all bg-gray-100 p-2 rounded">
                    {appointment.paymentTxHash}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> The doctor will review your appointment request and
              contact you within 24 hours to confirm the appointment time and discuss any additional
              details needed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/patient/my-appointments">
              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View My Appointments
              </button>
            </Link>
            <Link href="/patient/dashboard">
              <button className="w-full py-3 px-4 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span>The doctor will review your appointment request</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span>You will receive a notification when the appointment is approved</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span>The doctor may contact you to discuss additional details</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Arrive 10 minutes early on the appointment date</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
