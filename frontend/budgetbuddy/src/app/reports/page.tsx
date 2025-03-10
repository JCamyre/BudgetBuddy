"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// random test data for now
const generateTestData = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return months.map((month, index) => ({
    timestamp: month,
    Food: Math.floor(Math.random() * 500) + 100, //food
    Entertainment: Math.floor(Math.random() * 300) + 50, //ent
    Utility: Math.floor(Math.random() * 200) + 30, //util
  }));
};

const Reports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetching test data
    setData(generateTestData());
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Your 2024 Yearly Spending Report:
      </h2>

      {/* Responsive Chart Container */}
      <div className="w-full h-[500px] bg-white p-4 rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Expense Lines */}
            <Line type="monotone" dataKey="Food" stroke="#4caf50" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Entertainment" stroke="#1E88E5" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Utility" stroke="#8E44AD" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
