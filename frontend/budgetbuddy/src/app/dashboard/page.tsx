// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/validate-session", {
          credentials: "include"
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Session validation failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/users/logout", {
        method: "POST",
        credentials: "include"
      });
      
      // Force full page reload to clear state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Section */}
      <div className="w-full flex justify-end p-4">
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-gray-600">Logged in as {user.email}</span>
          )}
          <button
            onClick={handleLogout}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Monthly Budget</h3>
              <p className="text-3xl font-bold mt-2">$2,500</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Current Expenses</h3>
              <p className="text-3xl font-bold mt-2">$1,200</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Remaining</h3>
              <p className="text-3xl font-bold mt-2">$1,300</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}