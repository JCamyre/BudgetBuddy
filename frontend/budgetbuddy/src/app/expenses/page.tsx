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
    Shopping: "text-blue-600",
    Travel: "text-yellow-600",
    Pets: "text-orange-600",
    Medical: "text-red-600",
    Rent: "text-indigo-600",
    Transportation: "text-cyan-600",
    Other: "text-gray-600",
  };

  const categories = ["Entertainment", "Food", "Utility", "Shopping", "Travel", "Pets", "Medical", "Rent", "Transportation", "Other"];

  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState({ amount: "", business: "", category: "" });
  
  // Add state for file upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Reset states
    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    
    // Create FormData and append the file
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // Make request to the track-receipt endpoint
      const response = await fetch('https://budgetbuddy-688497269708.us-west2.run.app/api/track-receipt', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload receipt');
      }
      
      // If successful, update UI
      setUploadSuccess(true);
      
      // Simulate adding a new transaction based on uploaded receipt
      // In a real app, you might want to fetch the actual processed data
      setTimeout(() => {
        // Add a new transaction with data that might come from the receipt
        const newTransaction = {
          amount: `$${(Math.random() * 100).toFixed(2)}`,
          business: `Receipt from ${file.name.split('.')[0]}`,
          category: categories[Math.floor(Math.random() * categories.length)]
        };
        
        setTransactions([newTransaction, ...transactions]);
        
        // Reset success message after a delay
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error('Error uploading receipt:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload receipt');
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = "";
    }
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
                    <span className={`ml-2 font-semibold ${categoryColors[transaction.category as keyof typeof categoryColors] || 'text-gray-600'}`}>
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
            <p className="font-semibold mt-2">Upload a receipt</p>
            <p className="text-sm text-gray-300">JPEG, PNG formats, up to 50MB</p>

            {/* Hidden File Input */}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              disabled={isUploading}
            />

            {/* Browse Files Button (Clickable) */}
            <label
              htmlFor="file-upload"
              className={`mt-4 inline-block ${
                isUploading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-white text-green-900 hover:bg-gray-200 cursor-pointer"
              } px-4 py-2 rounded-md font-semibold transition-all`}
            >
              {isUploading ? "Uploading..." : "Browse Files"}
            </label>
            
            {/* Upload Status Messages */}
            {uploadError && (
              <div className="mt-3 text-red-300 text-sm">
                Error: {uploadError}
              </div>
            )}
            
            {uploadSuccess && (
              <div className="mt-3 text-green-300 text-sm animate-pulse">
                Receipt uploaded successfully! Processing your data...
              </div>
            )}
            
            {isUploading && (
              <div className="mt-3 flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
