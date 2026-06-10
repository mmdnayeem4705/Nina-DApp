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
  createdAt: string;
}

export default function DoctorDashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [updateLoading, setUpdateLoading] = useState<number | null>(null);

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
          `/api/appointments?userId=${user.id}&role=doctor`
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

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    setUpdateLoading(appointmentId);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId
              ? { ...apt, status: newStatus as any }
              : apt
          )
        );
      }
    } catch (err) {
      console.error('[v0] Error updating appointment:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your doctor console...</p>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(
    (apt) => filterStatus === 'all' || apt.status === filterStatus
  );

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800',
    completed: 'bg-sky-100 text-sky-800',
    cancelled: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-gray-50/95 border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Doctor Dashboard</h1>
            <p className="mt-1 text-gray-600">Welcome, Dr. {user.fullName || 'Doctor'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/doctor/profile">
              <button className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-300/50 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600">
                My Profile
              </button>
            </Link>
            <Link href="/doctor/settings">
              <button className="rounded-full bg-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-300/50 transition duration-300 hover:-translate-y-0.5 hover:bg-purple-600">
                Settings
              </button>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-red-300/50 transition duration-300 hover:-translate-y-0.5 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="glass-card p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm font-medium uppercase tracking-wide text-gray-600">Total Appointments</div>
            <div className="mt-3 text-4xl font-semibold text-gray-900">{appointments.length}</div>
          </div>
          <div className="glass-card p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm font-medium uppercase tracking-wide text-gray-600">Pending</div>
            <div className="mt-3 text-4xl font-semibold text-amber-600">{appointments.filter((apt) => apt.status === 'pending').length}</div>
          </div>
          <div className="glass-card p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm font-medium uppercase tracking-wide text-gray-600">Approved</div>
            <div className="mt-3 text-4xl font-semibold text-emerald-600">{appointments.filter((apt) => apt.status === 'approved').length}</div>
          </div>
          <div className="glass-card p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-sm font-medium uppercase tracking-wide text-gray-600">Completed</div>
            <div className="mt-3 text-4xl font-semibold text-sky-600">{appointments.filter((apt) => apt.status === 'completed').length}</div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {['pending', 'approved', 'rejected', 'completed', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 capitalize ${
                filterStatus === status
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="glass-card overflow-hidden shadow-lg">
          {loading ? (
            <div className="p-12 text-center text-gray-600">
              <div className="w-14 h-14 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-gray-600">No appointments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-gray-900">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Patient ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Reason</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Fee</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900">Patient #{apt.patientId}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{new Date(apt.appointmentDate).toLocaleDateString()} - {new Date(apt.appointmentDate).toLocaleTimeString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{apt.reason}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.consultationFee} ETH</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${apt.paymentStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {apt.paymentStatus ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(apt.id, 'approved')}
                                disabled={updateLoading === apt.id}
                                className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition duration-200 hover:bg-emerald-600 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(apt.id, 'rejected')}
                                disabled={updateLoading === apt.id}
                                className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white transition duration-200 hover:bg-red-600 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => router.push(`/doctor/appointment/${apt.id}`)}
                            className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition duration-200 hover:bg-sky-600"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
