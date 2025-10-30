import React, { useEffect, useState } from "react";
import {
  getCoaches,
  addCoach,
  updateCoach,
  deleteCoach,
} from "../api/coachService";
import type { Coach } from "../types/coach";
import CoachForm from "../components/CoachForm";
import CoachTable from "../components/CoachTable"; // ✅ FIX: Import missing component

const Dashboard: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    rating: "",
    sort: "",
    order: "asc",
    page: 1,
    limit: 5,
  });
  const [showForm, setShowForm] = useState(false);
  const [editCoach, setEditCoach] = useState<Coach | null>(null);

  const fetchCoaches = async () => {
    try {
      const res = await getCoaches(filters);
      // ✅ Backend returns { page, totalItems, data: [...] }
      setCoaches(res.data.data || []);
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this coach?")) return;
    await deleteCoach(id);
    fetchCoaches();
  };

  const handleSave = async (data: Partial<Coach>) => {
    try {
      if (editCoach) {
        await updateCoach(editCoach.id, data);
      } else {
        await addCoach(data as Coach);
      }
      setShowForm(false);
      setEditCoach(null);
      fetchCoaches();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coach Management</h1>

      {/* 🔍 Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Category"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort by</option>
          <option value="id">ID</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Coach
        </button>
      </div>

      {/* 🧾 Table */}
      <CoachTable
        coaches={coaches}
        onEdit={(coach) => {
          setEditCoach(coach);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onStatusChange={async (id, newStatus) => {
          await updateCoach(id, { status: newStatus });
          fetchCoaches();
        }}
      />

      {/* 📝 Add/Edit Modal */}
      {showForm && (
        <CoachForm
          initialData={editCoach}
          onSubmit={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditCoach(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
