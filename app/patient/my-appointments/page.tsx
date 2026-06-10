'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export default function MyAppointments() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `/api/appointments?userId=${user.id}&role=patient`
        );
        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error('[v0] Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchAppointments, 10000);

    return () => clearInterval(interval);
  }, [user]);

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
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/patient/dashboard">
              <button className="text-blue-600 hover:text-blue-700 font-medium mb-4">
                ← Back to Dashboard
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">You have no appointments yet.</p>
            <Link href="/patient/dashboard">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Book an Appointment
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Appointment #{apt.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Doctor ID: {apt.doctorId}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at{' '}
                      {new Date(apt.appointmentDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="font-medium text-gray-900">{apt.reason || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="font-medium text-green-600">{apt.consultationFee} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                        apt.paymentStatus
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {apt.paymentStatus ? 'Paid' : 'Pending Payment'}
                    </span>
                  </div>
                </div>

                {apt.symptoms && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Symptoms</p>
                    <p className="text-gray-900">{apt.symptoms}</p>
                  </div>
                )}

                {apt.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-900">{apt.description}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => setSelectedAppointment(apt)}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => {
                        // Cancel appointment logic
                        console.log('Cancel appointment:', apt.id);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Appointment Details
              </h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Appointment ID</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      statusColors[selectedAppointment.status]
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedAppointment.appointmentDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Doctor ID</p>
                <p className="font-medium text-gray-900">{selectedAppointment.doctorId}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Reason for Visit</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.reason || 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Symptoms</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.symptoms || 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.description || 'Not specified'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.bloodGroup || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Allergies</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.allergies || 'None'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="font-medium text-green-600">
                    {selectedAppointment.consultationFee} ETH
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      selectedAppointment.paymentStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedAppointment.paymentStatus ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>

              {selectedAppointment.paymentTxHash && (
                <div>
                  <p className="text-sm text-gray-600">Transaction Hash</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {selectedAppointment.paymentTxHash}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
