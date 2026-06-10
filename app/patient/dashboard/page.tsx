'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ThemeToggle';

interface Doctor {
  id: number;
  fullName: string;
  walletAddress: string;
  specialization: string;
  yearsOfExperience: number | null;
  consultationFee: string;
  bio: string | null;
  isVerified: boolean | null;
}

export default function PatientDashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const url = selectedSpecialty
          ? `/api/doctors?specialization=${selectedSpecialty}`
          : '/api/doctors';
        const response = await fetch(url);
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error('[v0] Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your patient workspace...</p>
        </div>
      </div>
    );
  }

  const specialties = [
    'cardiology',
    'neurology',
    'orthopedics',
    'dermatology',
    'ophthalmology',
    'general_medicine',
    'pediatrics',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="bg-card border-b border-border shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary/25">N</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Nina Hospital</h1>
              <p className="text-xs text-muted-foreground">Welcome, {user.fullName || 'Patient'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link href="/patient/my-appointments">
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90 cursor-pointer">
                My Appointments
              </button>
            </Link>
            <Link href="/patient/organ-donation">
              <button className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/15 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-500 cursor-pointer">
                Organ Donation
              </button>
            </Link>
            <Link href="/patient/settings">
              <button className="rounded-full bg-muted px-5 py-2 text-sm font-semibold text-foreground border border-border transition duration-300 hover:bg-muted/80 cursor-pointer">
                Settings
              </button>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/15 transition duration-300 hover:-translate-y-0.5 hover:bg-rose-400 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <section className="glass-card p-6 shadow-xl animate-fade-in-up">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Find Doctors by Specialization</h2>
              <p className="mt-2 text-muted-foreground">Filter providers and choose the best specialist for your care.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              <button
                onClick={() => setSelectedSpecialty('')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 cursor-pointer ${
                  selectedSpecialty === ''
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground border border-border hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition duration-300 cursor-pointer ${
                    selectedSpecialty === specialty
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground border border-border hover:bg-muted/80'
                  }`}
                >
                  {specialty.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Available Doctors</h2>
            <p className="text-sm text-gray-600">Tap a card to book your next appointment.</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 border-4 border-gray-300 border-t-sky-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="glass-card p-10 text-center text-gray-600">No doctors found for this specialization.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="glass-card p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.fullName}</h3>
                    <p className="text-sm text-sky-600 font-medium capitalize">{doctor.specialization.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-5">
                    {doctor.yearsOfExperience && (
                      <p>
                        <span className="font-medium text-gray-900">Experience:</span> {doctor.yearsOfExperience} years
                      </p>
                    )}
                    {doctor.consultationFee && (
                      <p>
                        <span className="font-medium text-gray-900">Fee:</span> {doctor.consultationFee} ETH
                      </p>
                    )}
                    {doctor.isVerified && (
                      <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Verified Doctor</p>
                    )}
                  </div>

                  {doctor.bio && (
                    <p className="text-sm leading-6 text-gray-600 mb-6 line-clamp-2">{doctor.bio}</p>
                  )}

                  <Link href={`/patient/book-appointment/${doctor.id}`}>
                    <button className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-sky-300/50 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
