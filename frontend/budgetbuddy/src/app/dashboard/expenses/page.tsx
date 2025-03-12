"use client";

import React, { useState, useEffect } from "react";

interface Transaction {
  id?: string;
  amount: string;
  business: string;
  category: string;
}

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Transaction>({
    amount: "",
    business: "",
    category: "",
  });
  
  // Add receipt upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const categories = [
    "Entertainment", 
    "Food", 
    "Utility", 
    "Shopping", 
    "Travel", 
    "Pets", 
    "Medical", 
    "Rent", 
    "Transportation", 
    "Other"
  ];

  // Auth check function
  const checkAuth = async () => {
    try {
      console.log("Fetching session validation...");
      const response = await fetch("https://budgetbuddy-688497269708.us-west2.run.app/api/validate-session", {
        method: "GET",
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("Session validation failed - Response not OK");
        return false;
      }

      const data = await response.json();
      console.log("Session validation result:", data);

      return data.valid;
    } catch (error) {
      console.error("Session validation failed:", error);
      return false;
    }
  };

  // Fetch expenses if authenticated
  useEffect(() => {
    const fetchData = async () => {
      console.log("Checking auth...");
      if (!(await checkAuth())) {
        console.log("User not authenticated");
        setLoading(false);
        return;
      }
    
      try {
        console.log("Fetching expenses...");
        const response = await fetch("https://budgetbuddy-688497269708.us-west2.run.app/api/expenses/view", {
          method: "GET",
          credentials: "include",
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch expenses");
        }
    
        const data = await response.json();
        console.log("Expenses fetched:", data);
    
        // Normalize and ensure properties are never null or undefined
        const mappedData = data.map((item: any) => ({
          id: item.id,
          amount: item.amount || "0", // Default to "0" if missing
          business: item.business ?? "", // Ensure business is always a string
          category: item.category ?? "", // Ensure category is always a string
        }));
    
        setTransactions(mappedData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };    

    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading receipt:", file.name);
      const response = await fetch("https://budgetbuddy-688497269708.us-west2.run.app/api/track-receipt", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload receipt");
      }

      const result = await response.json();
      console.log("Receipt processed:", result);
      
      // Format the new expense with data from the receipt
      const newExpense: Transaction = {
        amount: result.amount ? `$${parseFloat(result.amount).toFixed(2)}` : "$0.00",
        business: result.business_name || "Unknown Merchant", 
        category: result.category || "Other"
      };
      
      // Add the new expense to the transactions list
      setTransactions(prevTransactions => [newExpense, ...prevTransactions]);
      
      // Show success message
      setUploadSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error uploading receipt:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to upload receipt");
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = "";
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditData(transactions[index]);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;
  
    const expenseId = transactions[editingIndex].id;
    if (!expenseId) return;
  
    const updatedExpense = {
      id: String(expenseId),  // ✅ Convert UUID to string
      amount: Number(editData.amount),
      category: editData.category,
      business_name: editData.business,
    };
  
    console.log("Sending update payload:", updatedExpense);
  
    try {
      const response = await fetch(
        `https://budgetbuddy-688497269708.us-west2.run.app/api/expenses/update/${expenseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedExpense),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update expense");
      }
  
      const updatedExpenseData = await response.json();
      const updatedTransactions = [...transactions];
      updatedTransactions[editingIndex] = updatedExpenseData;
      setTransactions(updatedTransactions);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };
  

  const deleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(
        `https://budgetbuddy-688497269708.us-west2.run.app/api/expenses/delete/${expenseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setTransactions(transactions.filter((expense) => expense.id !== expenseId));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-white p-6 gap-8 min-h-screen">
      {/* Left Column - Transactions List */}
      <div
        className="w-2/3 bg-green-50 p-6 rounded-lg shadow-md"
        style={{ height: "fit-content" }}
      >
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
            <div
              key={transaction.id || i}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
            >
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
                    <span className="font-bold">{transaction.amount}</span> -{" "}
                    <span className="italic"> {transaction.business} </span>
                    <span
                      className={`ml-2 font-semibold ${categoryColors[transaction.category as keyof typeof categoryColors] || 'text-gray-600'}`}
                    >
                      {transaction.category}
                    </span>
                  </div>
                  <div>
                    <button
                      className="text-gray-500 text-sm hover:text-gray-700 mr-2"
                      onClick={() => startEditing(i)}
                    >
                      edit
                    </button>
                    <button
                      className="text-gray-500 text-sm hover:text-gray-700"
                      onClick={() => transaction.id && deleteExpense(transaction.id)}
                    >
                      delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Budget Overview & File Upload */}
      <div className="w-1/3 flex flex-col gap-6">
        {/* Budget Overview */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full text-center">
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
        </div> */}

        {/* File Upload Section */}
        <div className="sticky top-20 bg-green-900 p-6 rounded-lg shadow-md text-white w-full max-w-full">
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
            <span className="text-4xl">📤</span>
            <p className="font-semibold mt-2">Upload a receipt</p>
            <p className="text-sm text-gray-300">JPEG, PNG formats, up to 50MB</p>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              disabled={isUploading}
            />

            <label
              htmlFor="file-upload"
              className={`mt-4 inline-block ${
                isUploading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-white text-green-900 hover:bg-gray-200 cursor-pointer"
              } px-4 py-2 rounded-md font-semibold transition-all`}
            >
              {isUploading ? "Processing Receipt..." : "Browse Files"}
            </label>
            
            {/* Upload Status */}
            {isUploading && (
              <div className="mt-4 flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                <p className="text-sm mt-2">Extracting information from your receipt...</p>
              </div>
            )}
            
            {/* Success Message */}
            {uploadSuccess && (
              <div className="mt-4 bg-green-800 p-2 rounded text-white text-sm animate-pulse">
                Receipt processed successfully! Transaction added.
              </div>
            )}
            
            {/* Error Message */}
            {uploadError && (
              <div className="mt-4 bg-red-800 p-2 rounded text-white text-sm">
                {uploadError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}