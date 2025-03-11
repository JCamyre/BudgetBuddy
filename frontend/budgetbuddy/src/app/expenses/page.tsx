"use client";

import React, { useState } from "react";

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState([
    { amount: "$100.00", business: "AMC Century City", category: "Entertainment" },
    { amount: "$80.00", business: "Whole Foods Market", category: "Food" },
    { amount: "$20.00", business: "SoCal Gas", category: "Utility" },
  ]);

  const categoryColors = {
    Entertainment: "text-pink-600",
    Food: "text-green-600",
    Utility: "text-purple-600",
  };

  const categories = ["Entertainment", "Food", "Utility"];

  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState({ amount: "", business: "", category: "" });

  // Filter transactions based on search input
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Start Editing a Transaction
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditData(transactions[index]);
  };

  // Handle Input Changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save Edited Transaction
  const saveEdit = () => {
    const updatedTransactions = [...transactions];
    updatedTransactions[editingIndex as number] = editData;
    setTransactions(updatedTransactions);
    setEditingIndex(null);
  };

  return (
    <div className="flex bg-white p-6 gap-8 min-h-screen">
      {/* Left Column - Transactions List */}
      <div className="w-2/3 bg-green-50 p-6 rounded-lg shadow-md" style={{ height: "fit-content" }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search or filter transactions"
          className="w-full p-2 border rounded-md mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <h2 className="text-xl font-semibold mb-4 text-gray-700">March 2025</h2>
        <div className="space-y-4">
          {filteredTransactions.map((transaction, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
              {editingIndex === i ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                    className="w-20 p-1 border rounded-md"
                  />
                  <input
                    type="text"
                    name="business"
                    value={editData.business}
                    onChange={handleEditChange}
                    className="p-1 border rounded-md"
                  />
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                    className="p-1 border rounded-md"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={saveEdit}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="ml-1 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-bold">{transaction.amount}</span> -
                    <span className="italic"> {transaction.business} </span>
                    <span className={`ml-2 font-semibold ${categoryColors[transaction.category as keyof typeof categoryColors]}`}>
                      {transaction.category}
                    </span>
                  </div>
                  <button
                    className="text-gray-500 text-sm hover:text-gray-700"
                    onClick={() => startEditing(i)}
                  >
                    edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Budget Overview & File Upload */}
      <div className="w-1/3 flex flex-col gap-6">
        {/* Budget Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full text-center">
          <h2 className="text-lg font-semibold text-gray-700">Budget Overview</h2>
          <div className="relative w-40 h-40 mx-auto mt-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                className="stroke-current text-gray-200"
                strokeWidth="3"
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
              />
              <circle
                className="stroke-current text-green-500"
                strokeWidth="3"
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                strokeDasharray="25, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
              25%
            </div>
            <p className="text-sm text-gray-600 mt-2">of monthly budget spent</p>
          </div>
          <div className="mt-14 text-left px-6">
            <p className="text-teal-600 font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-600 rounded-full"></span> Food
            </p>
            <p className="text-pink-600 font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-pink-600 rounded-full"></span> Entertainment
            </p>
            <p className="text-purple-600 font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-600 rounded-full"></span> Utility
            </p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="sticky top-20 bg-green-900 p-6 rounded-lg shadow-md text-white w-full max-w-full">
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
            <span className="text-4xl">📤</span>
            <p className="font-semibold mt-2">Choose a file</p>
            <p className="text-sm text-gray-300">JPEG, PNG formats, up to 50MB</p>

            {/* Hidden File Input */}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => console.log(e.target.files)}
            />

            {/* Browse Files Button (Clickable) */}
            <label
              htmlFor="file-upload"
              className="mt-4 inline-block bg-white text-green-900 px-4 py-2 rounded-md font-semibold cursor-pointer hover:bg-gray-200 transition-all"
            >
              Browse Files
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
