// app/dashboard/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppNav from '@/components/AppNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch('https://budgetbuddy-688497269708.us-west2.run.app/api/validate-session', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    validateSession();
  }, [router]);

  return (
    <>
      <AppNav />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}