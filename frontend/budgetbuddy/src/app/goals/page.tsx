"use client";

import React, { useState, useEffect } from "react";

interface Goal {
  id: string;
  goal_name: string;
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

    // short-term if the goal is within the next 3 months
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
  const [newGoal, setNewGoal] = useState<Goal>({
    id: "",
    goal_name: "",
    target_amount: 0,
    current_progress: 0,
    actionable_amount: 0,
    frequency: "month",
    target_date: "",
  });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const user_id = 1; // Replace with the actual user ID (from authentication)
        const response = await fetch(`http://127.0.0.1:8000/goals/?user_id=${user_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.goal_name || !newGoal.target_amount || !newGoal.target_date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/goals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newGoal.goal_name,
          target_amount: newGoal.target_amount,
          current_amount: newGoal.current_progress,
          actionable_amount: newGoal.actionable_amount,
          frequency: newGoal.frequency,
          deadline: new Date(newGoal.target_date).toISOString(),
          user_id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal");
      }

      const createdGoal = await response.json();
      console.log("Received goal:", createdGoal);

      setGoals([...goals, {
        ...createdGoal,
        goal_name: createdGoal.title,
        target_date: createdGoal.deadline,
      }]);

      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleEdit = (goal: Goal) => {
    console.log("Editing goal:", goal);
    setEditingGoal({
      ...goal,
      target_date: goal.target_date || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
  
    console.log("Editing goal before update:", editingGoal);
  
    if (
      !editingGoal.id ||
      !editingGoal.goal_name.trim() ||
      isNaN(Number(editingGoal.current_progress))
    ) {
      console.error("Invalid editingGoal data:", editingGoal);
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const currentProgress = Number(editingGoal.current_progress);
      const formattedDate = new Date(editingGoal.target_date).toISOString();
  
      console.log("Sending update request with:", {
        title: editingGoal.goal_name.trim(),
        target_amount: editingGoal.target_amount,
        current_amount: currentProgress, 
        actionable_amount: editingGoal.actionable_amount,
        frequency: editingGoal.frequency,
        deadline: formattedDate,
        user_id: 1,
      });
  
      const response = await fetch(`http://127.0.0.1:8000/goals/${editingGoal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingGoal.goal_name.trim(),
          target_amount: editingGoal.target_amount,
          current_amount: currentProgress,
          actionable_amount: editingGoal.actionable_amount,
          frequency: editingGoal.frequency,
          deadline: formattedDate,
          user_id: 1,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error("Failed to update goal");
      }
  
      const updatedGoal = await response.json();
      console.log("Received updated goal:", updatedGoal);
  
      const updatedGoals = goals.map((goal) =>
        goal.id === updatedGoal.id
          ? {
              ...updatedGoal,
              goal_name: updatedGoal.title, 
              current_progress: updatedGoal.current_amount, 
              target_date: updatedGoal.deadline, 
            }
          : goal
      );
  
      setGoals(updatedGoals);
      setEditingGoal(null);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
        console.log("Deleting goal with ID:", goalId);
        const response = await fetch(`http://127.0.0.1:8000/goals/${goalId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error("Failed to delete goal");
        }

        const updatedGoals = goals.filter((goal) => goal.id !== goalId);
        setGoals(updatedGoals);
    } catch (error) {
        console.error("Error deleting goal:", error);
    }
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
        onClick={() => {
          setShowCreateForm(!showCreateForm);
          setNewGoal({
            id: "",
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

      {/* Create New Goal Form */}
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
              {/* Progress Bar */}
              <div className="w-full bg-green-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${((goal.current_progress ?? 0) / (goal.target_amount ?? 1)) * 100}%`,
                  }}
                ></div>
              </div>
              {/* Progress Text */}
              <span className="text-sm text-green-700">
                ${goal.current_progress?.toLocaleString() ?? "0"} of ${goal.target_amount?.toLocaleString() ?? "N/A"}
              </span>
            </td>
            <td className="p-3">
              Save ${goal.actionable_amount} per {goal.frequency}
            </td>
            <td className="p-3">{new Date(goal.target_date).toLocaleDateString()}</td>
            <td className="p-3">
              <button
                onClick={() => onEdit(goal)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  console.log("Deleting goal with ID:", goal.id);
                  onDelete(goal.id);
                }}
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