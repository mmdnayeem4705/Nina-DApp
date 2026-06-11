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

      <div className="relative flex min-h-screen items-center justify-center px-4 py-16 md:py-24">
        <div className="grid w-full max-w-7xl gap-8 xl:grid-cols-[1.2fr_1fr] items-stretch">
          
          {/* Main Hero Card for Nina Hospital */}
          <section className="hero-card p-8 sm:p-12 animate-fade-in-up flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30 transform transition-transform hover:scale-110">N</div>
                <div>
                  <span className="text-2xl font-black tracking-tighter text-foreground block">Nina Hospital</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Healthcare Excellence</span>
                </div>
              </div>

              {/* Hospital building image with better aspect ratio */}
              <div className="relative overflow-hidden rounded-[2rem] border border-border/50 shadow-2xl mb-10 aspect-[16/9] sm:aspect-[21/9] w-full group">
                <img
                  src="https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg"
                  alt="Nina Hospital Building"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-foreground bg-background/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    Official Facility Portal
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <span className="inline-flex rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold tracking-wide text-primary uppercase">
                  Enterprise-grade booking interface
                </span>
                <h1 className="text-4xl sm:text-xl font-black tracking-tight text-foreground leading-[1.1]">
                  Professional appointment management.
                </h1>
                <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-muted-foreground/90 font-medium">
                  Secure Web3 wallet access, polished dashboards, and smooth workflow for a premium healthcare experience.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3 relative z-10">
              <div className="panel-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="font-bold text-foreground text-base">Fast access</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-medium">Wallet-based sign in with instant verification.</p>
              </div>
              <div className="panel-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="font-bold text-foreground text-base">Modern dashboards</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-medium">Clear patient and doctor views for appointments and status.</p>
              </div>
              <div className="panel-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-foreground text-base">Smart interactions</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-medium">Animated transitions and polished cards for an engaging UX.</p>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </section>

          {/* Login or Register Card */}
          <div className="glass-card animate-slide-in-left p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Featured Blog Image */}
            <a 
              href="https://www.trinityschoolofmedicine.org/about/resources/blog/different-types-of-doctors" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-[1.5rem] border border-border/50 shadow-xl mb-10 aspect-video w-full group transition-all hover:shadow-2xl hover:border-primary/40"
            >
              <img
                src="https://cdn.prod.website-files.com/66bd394eedeb9d6ee29898c6/682f5450a046c241920c1e6f_Three%20doctors%20standing%20side%20by%20side%2C%20crossing%20their%20arms.jpg"
                alt="Different Types of Doctors"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="rounded-full bg-primary/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/20 mb-2 w-fit">
                    Featured Article
                  </div>
                  <p className="text-sm font-bold text-foreground leading-tight">Explore the different types of medical specialists</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center border border-white/20 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </a>

            <div className="mb-10 relative z-10">
              <h2 className="text-4xl font-black tracking-tight text-foreground mb-3">Login or Register</h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">Connect your wallet to manage appointments, profiles, and payments securely.</p>
            </div>
            
            <div className="relative z-10">
              <AuthForm onSuccess={() => {}} />
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
