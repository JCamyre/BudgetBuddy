// app/dashboard/page.tsx
"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4">
            Welcome Back to BudgetBuddy!
          </h1>
          <p className="text-xl text-green-800">
            We’re thrilled to help you manage your finances more effectively.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thanks for Signing In Today!
          </h2>
          <p className="text-gray-700 mb-4">
            With BudgetBuddy, you can stay on top of your budget, keep track of 
            expenses, set financial goals, and unlock personalized insights. 
            Everything you need is just a click away in the navigation bar.
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Update and monitor your monthly budget</li>
            <li>Manage expenses effortlessly</li>
            <li>Set and achieve your financial goals</li>
            <li>Access AI-driven insights for smarter spending</li>
          </ul>

          <p className="text-gray-700 font-semibold">
            Have a great day, and let BudgetBuddy make your financial journey stress-free!
          </p>
        </div>
      </main>
    </div>
  );
}
