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
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle the create form

  useEffect(() => {
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
    setShowCreateForm(false); // Hide the form after submission
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    const updatedGoals = goals.map((goal) =>
      goal.id === editingGoal.id ? editingGoal : goal
    );

    setGoals(updatedGoals);
    setEditingGoal(null);
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold text-gray-300">Loading...</div>;
  }

  const { shortTerm, longTerm } = categorizeGoals(goals);

  return (
    <div className="p-8 bg-white min-h-screen text-green-900">
      <h1 className="text-4xl font-bold mb-8">Financial Goals</h1>

      {/* Button to Show Create New Goal Form */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="mb-8 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition-colors"
      >
        {showCreateForm ? "Hide Form" : "Create a New Goal"}
      </button>

      {/* Create New Goal Form (Conditionally Rendered) */}
      {showCreateForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-green-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create a New Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal Name"
              className="p-2 border border-green-300 rounded bg-white text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500"
              value={newGoal.goal_name}
              onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Target Amount ($)"
              className="p-2 border border-green-300 rounded bg-white text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500"
              value={newGoal.target_amount || ""}
              onChange={(e) => setNewGoal({ ...newGoal, target_amount: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Actionable Goals"
              className="p-2 border border-green-300 rounded bg-white text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500"
              value={newGoal.actionable_goals}
              onChange={(e) => setNewGoal({ ...newGoal, actionable_goals: e.target.value })}
            />
            <input
              type="date"
              className="p-2 border border-green-300 rounded bg-white text-green-900 focus:outline-none focus:border-green-500"
              value={newGoal.target_date}
              onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Goal
          </button>
        </form>
      )}

      {/* Edit Goal Form */}
      {editingGoal && (
        <form onSubmit={handleUpdate} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Edit Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal Name"
              className="p-2 border border-blue-300 rounded bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500"
              value={editingGoal.goal_name}
              onChange={(e) => setEditingGoal({ ...editingGoal, goal_name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Target Amount ($)"
              className="p-2 border border-blue-300 rounded bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500"
              value={editingGoal.target_amount || ""}
              onChange={(e) => setEditingGoal({ ...editingGoal, target_amount: Number(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Actionable Goals"
              className="p-2 border border-blue-300 rounded bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500"
              value={editingGoal.actionable_goals}
              onChange={(e) => setEditingGoal({ ...editingGoal, actionable_goals: e.target.value })}
            />
            <input
              type="date"
              className="p-2 border border-blue-300 rounded bg-white text-blue-900 focus:outline-none focus:border-blue-500"
              value={editingGoal.target_date}
              onChange={(e) => setEditingGoal({ ...editingGoal, target_date: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Update Goal
          </button>
          <button
            type="button"
            onClick={() => setEditingGoal(null)}
            className="mt-4 ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      <h2 className="text-3xl font-semibold mt-8 mb-4">Short-Term Goals</h2>
      {shortTerm.length === 0 ? (
        <p className="text-green-700">No short-term goals yet.</p>
      ) : (
        <GoalTable goals={shortTerm} onEdit={handleEdit} />
      )}

      <h2 className="text-3xl font-semibold mt-8 mb-4">Long-Term Goals</h2>
      {longTerm.length === 0 ? (
        <p className="text-green-700">No long-term goals yet.</p>
      ) : (
        <GoalTable goals={longTerm} onEdit={handleEdit} />
      )}
    </div>
  );
};

const GoalTable = ({ goals, onEdit }: { goals: Goal[]; onEdit: (goal: Goal) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead className="bg-green-700 text-white">
        <tr>
          <th className="p-3 text-left">Goal Name</th>
          <th className="p-3 text-left">Target Amount</th>
          <th className="p-3 text-left">Progress</th>
          <th className="p-3 text-left">Actionable Goals</th>
          <th className="p-3 text-left">Target Date</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {goals.map((goal) => (
          <tr
            key={goal.id}
            className="border-b border-green-100 hover:bg-green-50 transition-colors"
          >
            <td className="p-3">{goal.goal_name}</td>
            <td className="p-3">${goal.target_amount.toLocaleString()}</td>
            <td className="p-3">
              <div className="w-full bg-green-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(goal.current_progress / goal.target_amount) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-green-700">
                ${goal.current_progress.toLocaleString()} of ${goal.target_amount.toLocaleString()}
              </span>
            </td>
            <td className="p-3">{goal.actionable_goals}</td>
            <td className="p-3">{new Date(goal.target_date).toLocaleDateString()}</td>
            <td className="p-3">
              <button
                onClick={() => onEdit(goal)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Goals;