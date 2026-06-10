'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Preparing your secure dashboard...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Header theme toggle */}
      <div className="absolute right-6 top-6 z-50 flex items-center gap-3">
        <ThemeToggle />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-7xl gap-10 xl:grid-cols-[1.3fr_1fr]">
          
          {/* Main Hero Card for Nina Hospital */}
          <section className="hero-card p-8 sm:p-10 animate-fade-in-up flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary/25">N</div>
                <span className="text-xl font-bold tracking-tight text-foreground">Nina Hospital</span>
              </div>

              {/* Hospital building image as requested */}
              <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg mb-8 h-64 sm:h-80 w-full group">
                <img
                  src="https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg"
                  alt="Nina Hospital Building"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 rounded-full bg-background/80 backdrop-blur px-4 py-1 text-xs font-semibold border border-border">
                  Official Facility Portal
                </div>
              </div>

              <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                Enterprise-grade booking interface
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Professional appointment management for patients and doctors.
              </h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                Secure Web3 wallet access, polished dashboards, and smooth workflow animations for a premium healthcare experience.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="panel-card p-5 shadow-sm transition hover:-translate-y-0.5">
                <h2 className="font-semibold text-foreground">Fast access</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Wallet-based sign in with instant verification.</p>
              </div>
              <div className="panel-card p-5 shadow-sm transition hover:-translate-y-0.5">
                <h2 className="font-semibold text-foreground">Modern dashboards</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Clear patient and doctor views for appointments and status.</p>
              </div>
              <div className="panel-card p-5 shadow-sm transition hover:-translate-y-0.5">
                <h2 className="font-semibold text-foreground">Smart interactions</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Animated transitions and polished cards for an engaging UX.</p>
              </div>
            </div>
          </section>

          {/* Login or Register Card */}
          <div className="glass-card animate-slide-in-left p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground">Login or Register</h2>
              <p className="mt-2 text-muted-foreground">Connect your wallet to manage appointments, profiles, and payments.</p>
            </div>
            <AuthForm onSuccess={() => {}} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
