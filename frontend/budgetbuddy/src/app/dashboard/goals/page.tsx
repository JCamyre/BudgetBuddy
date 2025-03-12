"use client";

import React, { useState, useEffect } from "react";

interface Goal {
  id: string;
  goal_name: number | string;
  target_amount: number;
  current_progress: number;
  actionable_amount: number;
  frequency: string;
  target_date: string;
}

const categorizeGoals = (goals: Goal[]) => {
  const currentDate = new Date();
  const shortTerm: Goal[] = [];
  const longTerm: Goal[] = [];

  goals.forEach((goal) => {
    const goalDate = new Date(goal.target_date);
    const monthsDifference =
      (goalDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (goalDate.getMonth() - currentDate.getMonth());

    if (monthsDifference <= 3 && monthsDifference >= 0) {
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
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    goal_name: "",
    target_amount: 0,
    current_progress: 0,
    actionable_amount: 0,
    frequency: "month",
    target_date: "",
  });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const checkAuth = async () => {
    try {
      console.log("Fetching session validation...");
      const response = await fetch('http://localhost:8000/api/validate-session', {
        method: 'GET',
        credentials: 'include',
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
      console.error('Session validation failed:', error);
      return false;
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      console.log("Checking auth...");
      if (!await checkAuth()) {
        console.log("User not authenticated");
        return;
      }
  
      try {
        console.log("Fetching goals...");
        const response = await fetch(`http://localhost:8000/api/goals/view`, {
          method: "GET",
          credentials: "include"
        });
  
        if (!response.ok) throw new Error("Failed to fetch goals");
        
        const data = await response.json();
        console.log("Goals fetched:", data);
  
        const transformedData = data.map((goal: any) => ({
          id: goal.id.toString(),
          goal_name: goal.title,
          target_amount: goal.target_amount,
          current_progress: goal.current_amount,
          actionable_amount: goal.actionable_amount,
          frequency: goal.frequency,
          target_date: new Date(goal.deadline).toISOString().split('T')[0]
        }));
  
        setGoals(transformedData);
        console.log("Goals state updated:", transformedData);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!await checkAuth()) {
      console.error("Not authenticated");
      return;
    }
  
    try {
      console.log("Sending create goal request");
      
      // Split the date string into components
      const [year, month, day] = newGoal.target_date.split('-');
      
      // Create a UTC date at midnight (00:00:00 UTC)
      const utcDate = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1, // Months are 0-indexed in JS
        parseInt(day)
      ));
  
      const response = await fetch("http://localhost:8000/api/goals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          new_goal: {
            title: newGoal.goal_name,
            target_amount: Number(newGoal.target_amount),
            current_amount: Number(newGoal.current_progress),
            actionable_amount: Number(newGoal.actionable_amount),
            frequency: newGoal.frequency,
            deadline: utcDate.toISOString()
          }
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create goal");
      }
  
      const createdGoal = await response.json();
      console.log("Goal created:", createdGoal);
      
      // Add the new goal to state with UTC date
      setGoals(prev => [...prev, {
        id: createdGoal.id.toString(),
        goal_name: createdGoal.title,
        target_amount: createdGoal.target_amount,
        current_progress: createdGoal.current_amount,
        actionable_amount: createdGoal.actionable_amount,
        frequency: createdGoal.frequency,
        target_date: utcDate.toISOString().split('T')[0] // Store UTC date
      }]);
  
      setShowCreateForm(false);
      setNewGoal({
        goal_name: "",
        target_amount: 0,
        current_progress: 0,
        actionable_amount: 0,
        frequency: "month",
        target_date: "",
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      alert(error instanceof Error ? error.message : "Failed to create goal");
    }
  };
  
  const handleEdit = (goal: Goal) => {
    setEditingGoal({
      ...goal,
      target_date: goal.target_date || "",
    });
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !await checkAuth()) return;
  
    try {
      const response = await fetch(`http://localhost:8000/api/goals/update/${editingGoal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: String(editingGoal.goal_name).trim(),
          target_amount: editingGoal.target_amount,
          current_amount: editingGoal.current_progress,
          actionable_amount: editingGoal.actionable_amount,
          frequency: editingGoal.frequency,
          deadline: new Date(editingGoal.target_date).toISOString()
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update goal");
      }
  
      const updatedGoal = await response.json();
      setGoals(goals.map(goal => 
        goal.id === updatedGoal.id.toString() ? {
          ...updatedGoal,
          id: updatedGoal.id.toString(),
          goal_name: updatedGoal.title,
          target_amount: updatedGoal.target_amount,
          current_progress: updatedGoal.current_amount,
          actionable_amount: updatedGoal.actionable_amount,
          frequency: updatedGoal.frequency,
          target_date: new Date(updatedGoal.deadline).toISOString().split("T")[0],
        }
      : goal
      ));
      setEditingGoal(null);
    } catch (error) {
      console.error("Error updating goal:", error);
      alert(error instanceof Error ? error.message : "Failed to update goal");
    }
  };
  
  
  const handleDelete = async (goalId: string) => {
    if (!await checkAuth()) return;
  
    try {
      const response = await fetch(`http://localhost:8000/api/goals/delete/${goalId}`, {
        method: "DELETE",
        credentials: "include"
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete goal");
      }
  
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert(error instanceof Error ? error.message : "Failed to delete goal");
    }
  };
  
  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold text-gray-300">Loading...</div>;
  }
  
  const { shortTerm, longTerm } = categorizeGoals(goals);
  
  return (
    <div className="p-8 bg-white min-h-screen text-green-900">
      <h1 className="text-4xl font-bold mb-8">Financial Goals</h1>
  
      <button
        onClick={() => {
          setShowCreateForm(!showCreateForm);
          setNewGoal({
            goal_name: "",
            target_amount: 0,
            current_progress: 0,
            actionable_amount: 0,
            frequency: "month",
            target_date: "",
          });
        }}
        className="mb-8 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition-colors"
      >
        {showCreateForm ? "Hide Form" : "Create a New Goal"}
      </button>
  
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
  
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-green-900 font-semibold">Save $</span>
              <input
                type="number"
                className="p-2 border border-green-300 rounded bg-white text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500 w-24"
                value={newGoal.actionable_amount || ""}
                onChange={(e) => setNewGoal({ ...newGoal, actionable_amount: Number(e.target.value) })}
                required
              />
              <span className="text-green-900 font-semibold">per</span>
              <select
                className="p-2 border border-green-300 rounded bg-white text-green-900 focus:outline-none focus:border-green-500"
                value={newGoal.frequency}
                onChange={(e) => setNewGoal({ ...newGoal, frequency: e.target.value })}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="year">Year</option>
              </select>
            </div>
  
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
              placeholder="Current Progress ($)"
              className="p-2 border border-blue-300 rounded bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500"
              value={editingGoal.current_progress || ""}
              onChange={(e) => setEditingGoal({ ...editingGoal, current_progress: Number(e.target.value) })}
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
        <GoalTable goals={shortTerm} onEdit={handleEdit} onDelete={handleDelete} />
      )}
  
      <h2 className="text-3xl font-semibold mt-8 mb-4">Long-Term Goals</h2>
      {longTerm.length === 0 ? (
        <p className="text-green-700">No long-term goals yet.</p>
      ) : (
        <GoalTable goals={longTerm} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};
  
const GoalTable = ({
  goals,
  onEdit,
  onDelete,
}: {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}) => (
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
            <td className="p-3">${goal.target_amount?.toLocaleString() ?? "N/A"}</td>
            <td className="p-3">
              <div className="w-full bg-green-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${((goal.current_progress ?? 0) / (goal.target_amount ?? 1)) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-green-700">
                ${goal.current_progress?.toLocaleString() ?? "0"} of ${goal.target_amount?.toLocaleString() ?? "N/A"}
              </span>
            </td>
            <td className="p-3">
              Save ${goal.actionable_amount} per {goal.frequency}
            </td>
            <td className="p-3">
              {new Date(goal.target_date).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              })}
            </td>

            <td className="p-3">
              <button
                onClick={() => onEdit(goal)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(goal.id)}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
  
export default Goals;