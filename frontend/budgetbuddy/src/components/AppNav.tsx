"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import logo from '../../public/logo.png';

const AppNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/validate-session', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return null;

  return (
    <nav className="bg-green-900 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logo as StaticImageData}
                alt="logo"
                height={40}
                width={40}
                className="rounded-full cursor-pointer"
              />
            </Link>
            {isLoggedIn && (
              <div className="hidden md:flex space-x-4 ml-6">
                <Link
                  href="/dashboard/expenses"
                  className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Expenses and Budget
                </Link>
                <Link
                  href="/dashboard/goals"
                  className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Financial Goals
                </Link>
                <Link
                  href="/dashboard/insights"
                  className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Personalized Insights
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="text-green-100 hover:bg-green-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Reports and Analytics
                </Link>
              </div>
            )}
          </div>

          <div>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-green-100 text-sm">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 text-sm font-medium"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 text-sm font-medium"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNav;