import React from "react";

export default function ExpensesPage() {
  // will sub with users' data
  const transactions = [
    { amount: "$120.00", business: "Netflix", category: "Entertainment" },
    { amount: "$50.00", business: "McDonald's", category: "Food" },
    { amount: "$200.00", business: "Electric Company", category: "Utility" },
    { amount: "$15.00", business: "Spotify", category: "Entertainment" },
    { amount: "$30.00", business: "Starbucks", category: "Food" },
    { amount: "$100.00", business: "Water Bill", category: "Utility" },
    { amount: "$60.00", business: "Movie Theater", category: "Entertainment" },
    { amount: "$75.00", business: "Grocery Store", category: "Food" },
    { amount: "$130.00", business: "Internet Provider", category: "Utility" },
    { amount: "$20.00", business: "Game Subscription", category: "Entertainment" },
  ];
  
  const categoryColors = {
    Entertainment: "text-[#e9b666]", // ent. - yellow
    Food: "text-[#f5b19c]", // food - pink
    Utility: "text-[#5c9090]", // utility - green
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* left */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
        {/* search bar */}
        <input
          type="text"
          placeholder="Search or filter transactions"
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* transactions (list) */}
        <h2 className="text-xl font-semibold mb-4">June 2024</h2>
        <div className="space-y-4">
          {transactions.map((transaction, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
              <div>
                <span className="font-bold">{transaction.amount}</span>
                <span className="italic"> {transaction.business}</span>
                <span className={`ml-2 font-semibold ${categoryColors[transaction.category]}`}>
                    {transaction.category}
                </span>
              </div>
              <button className="text-gray-500 text-sm hover:text-gray-700">edit</button>
            </div>
          ))}
        </div>
      </div>

      {/* right */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-center">Budget Overview</h2>

        {/* chart */}
        <div className="relative w-60 h-60 mx-auto mt-4">
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
              className="stroke-current text-[#5c9090]"
              strokeWidth="3"
              cx="18"
              cy="18"
              r="15.9155"
              fill="none"
              strokeDasharray="25, 100"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold text-[#5c9090]">25%</p>
            <p className="text-sm font-medium text-gray-600">of monthly budget spent</p>
          </div>
        </div>

        {/* categories */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#e9b666]"></span>
            <p className="text-[#004d40] font-semibold">Entertainment</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#f5b19c]"></span>
            <p className="text-[#004d40] font-semibold">Food</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#5c9090]"></span>
            <p className="text-[#004d40] font-semibold">Utility</p>
          </div>
        </div>

        <p className="text-gray-600 mt-4 italic cursor-pointer hover:underline">
          View budget by category
        </p>
      </div>
    </div>
  );
}