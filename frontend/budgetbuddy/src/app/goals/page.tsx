"use client";

import React, { useState, useEffect } from "react";

interface Goal {
  id: string;
  goal_name: string;
  target_amount: number;
  current_progress: number;
  actionable_goals: string;
  target_date: string;
}

const mockGoals: Goal[] = [
  {
    id: "1",
    goal_name: "Buy a House",
    target_amount: 200000,
    current_progress: 50000,
    actionable_goals: "Save $5000 monthly",
    target_date: "2025-12-30",
  },
  {
    id: "2",
    goal_name: "Vacation Savings",
    target_amount: 5000,
    current_progress: 1200,
    actionable_goals: "Save $200 per month",
    target_date: "2026-05-31",
  },
  {
    id: "3",
    goal_name: "Retirement Fund",
    target_amount: 1000000,
    current_progress: 200000,
    actionable_goals: "Invest $2000 monthly",
    target_date: "2039-12-31",
  },
];

// Separate Short-Term and Long-Term Goals
const categorizeGoals = (goals: Goal[]) => {
  const currentDate = new Date();
  const shortTerm: Goal[] = [];
  const longTerm: Goal[] = [];

  goals.forEach((goal) => {
    const goalDate = new Date(goal.target_date);
    if (goalDate.getFullYear() - currentDate.getFullYear() <= 5) {
      shortTerm.push(goal);
    } else {
      longTerm.push(goal);
    }
  });

  return { shortTerm, longTerm };
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState<Goal>({
    id: "",
    goal_name: "",
    target_amount: 0,
    current_progress: 0,
    actionable_goals: "",
    target_date: "",
  });

  useEffect(() => {
    // Simulate fetching from API
    setTimeout(() => {
      setGoals(mockGoals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.goal_name || !newGoal.target_amount || !newGoal.target_date) {
      alert("Please fill in all required fields.");
      return;
    }

    setGoals([...goals, { ...newGoal, id: (goals.length + 1).toString() }]);
    setNewGoal({
      id: "",
      goal_name: "",
      target_amount: 0,
      current_progress: 0,
      actionable_goals: "",
      target_date: "",
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold text-gray-300">Loading...</div>;
  }

  const { shortTerm, longTerm } = categorizeGoals(goals);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-8">Financial Goals</h1>

      {/* Goal Creation Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create a New Goal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Goal Name"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={newGoal.goal_name}
            onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Target Amount ($)"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={newGoal.target_amount || ""}
            onChange={(e) => setNewGoal({ ...newGoal, target_amount: Number(e.target.value) })}
            required
          />
          <input
            type="text"
            placeholder="Actionable Goals"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={newGoal.actionable_goals}
            onChange={(e) => setNewGoal({ ...newGoal, actionable_goals: e.target.value })}
          />
          <input
            type="date"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:border-blue-500"
            value={newGoal.target_date}
            onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add Goal
        </button>
      </form>

      {/* Short-Term Goals Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Short-Term Goals</h2>
      {shortTerm.length === 0 ? (
        <p className="text-gray-400">No short-term goals yet.</p>
      ) : (
        <GoalTable goals={shortTerm} />
      )}

      {/* Long-Term Goals Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Long-Term Goals</h2>
      {longTerm.length === 0 ? (
        <p className="text-gray-400">No long-term goals yet.</p>
      ) : (
        <GoalTable goals={longTerm} />
      )}
    </div>
  );
};

// Component for Rendering Goal Table
const GoalTable = ({ goals }: { goals: Goal[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead className="bg-gray-700">
        <tr>
          <th className="p-3 text-left">Goal Name</th>
          <th className="p-3 text-left">Target Amount</th>
          <th className="p-3 text-left">Progress</th>
          <th className="p-3 text-left">Actionable Goals</th>
          <th className="p-3 text-left">Target Date</th>
        </tr>
      </thead>
      <tbody>
        {goals.map((goal) => (
          <tr key={goal.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
            <td className="p-3">{goal.goal_name}</td>
            <td className="p-3">${goal.target_amount.toLocaleString()}</td>
            <td className="p-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(goal.current_progress / goal.target_amount) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">
                ${goal.current_progress.toLocaleString()} of ${goal.target_amount.toLocaleString()}
              </span>
            </td>
            <td className="p-3">{goal.actionable_goals}</td>
            <td className="p-3">{new Date(goal.target_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Goals;