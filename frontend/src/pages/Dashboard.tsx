import React, { useEffect, useState } from "react";
import {
  getCoaches,
  addCoach,
  updateCoach,
  deleteCoach,
  getCoachById, // ✅ import this from coachService
} from "../api/coachService";
import type { Coach } from "../types/coach";
import CoachForm from "../components/CoachForm";
import CoachTable from "../components/CoachTable";

const Dashboard: React.FC = () => {
  const defaultCategories = ["General"];
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    rating: "",
    sort: "id",
    order: "asc",
    page: 1,
    limit: 5,
  });
  const [showForm, setShowForm] = useState(false);
  const [editCoach, setEditCoach] = useState<Coach | null>(null);

  // 🆕 Search state
  const [searchId, setSearchId] = useState("");
  

  // ✅ Fetch all coaches
  const fetchCoaches = async () => {
    try {
      const res = await getCoaches(filters);
      const { data, totalItems, totalPages, page } = res.data;
      setCoaches(data || []);
      setMeta({ totalItems, totalPages, page });

      // ✅ Update category list dynamically
      const foundCats = data.map((coach: Coach) => coach.category);
      setCategories((prev) =>
        Array.from(new Set([...prev, ...foundCats].filter(Boolean)))
      );
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  useEffect(() => {
    fetchCoaches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // ✅ Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this coach?")) return;
    await deleteCoach(id);
    fetchCoaches();
  };

  // ✅ Add/Edit
  const handleSave = async (data: Partial<Coach>) => {
    try {
      if (editCoach) {
        await updateCoach(editCoach.id, data);
      } else {
        await addCoach(data as Coach);
      }

      if (data.category && !categories.includes(data.category)) {
        setCategories((prev) => [...prev, data.category!]);
      }

      setShowForm(false);
      setEditCoach(null);
      fetchCoaches();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // ✅ Pagination
  const handlePageChange = (direction: "next" | "prev") => {
    setFilters((prev) => {
      const newPage =
        direction === "next"
          ? Math.min(prev.page + 1, meta.totalPages)
          : Math.max(prev.page - 1, 1);
      return { ...prev, page: newPage };
    });
  };

  // 🆕 Search by ID
  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchCoaches();
      return;
    }
    try {
      const res = await getCoachById(Number(searchId));
      setCoaches([res.data]); // show single record
      setMeta({ page: 1, totalPages: 1, totalItems: 1 });
      //setSearchError("");
    } catch (err) {
      //setSearchError("Coach not found");
      setCoaches([]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coach Management</h1>

      {/* 🔍 Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Category Filter */}
        <select
          className="border p-2 rounded bg-gray-50 hover:bg-gray-100"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value, page: 1 })
          }
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border p-2 rounded bg-gray-50 hover:bg-gray-100"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
        >
          <option value="">All Status</option>
          <option className="text-green-700" value="active">Active</option>
          <option className="text-red-700 px-3 py-2 rounded-lg" value="inactive">Inactive</option>
        </select>

        {/* Sort Field */}
        <select
          className="border p-2 rounded bg-gray-50 hover:bg-gray-100"
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value, page: 1 })
          }
        >
          <option value="id">Sort by ID</option>
          <option value="rating">Sort by Rating</option>
          <option value="name">Sort by Name</option>
        </select>

        {/* Order Direction */}
        <select
          className="border p-2 rounded bg-gray-50 hover:bg-gray-100"
          value={filters.order}
          onChange={(e) =>
            setFilters({ ...filters, order: e.target.value, page: 1 })
          }
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>

        {/* Limit */}
        <select
          className="border p-2 rounded bg-gray-50 hover:bg-gray-100"
          value={filters.limit}
          onChange={(e) =>
            setFilters({
              ...filters,
              limit: Number(e.target.value),
              page: 1,
            })
          }
        >
          {[3, 5, 10, 20].map((num) => (
            <option key={num} value={num}>
              {num} per page
            </option>
          ))}
        </select>

        {/* ➕ Add Coach */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Coach
        </button>

        {/* 🔎 Search by ID */}
<div className="flex flex-col">
  <div className="flex items-center border border-gray-300 rounded-lg bg-white px-2 gap-1 py-1 shadow-sm">
    <input
      type="text"
      inputMode="numeric" // disables number spinners
      pattern="[1-9]*"
      placeholder="Search by ID"
      className="outline-none px-2 w-32 text-gray-700 placeholder-gray-400"
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
    />
    <button
      onClick={handleSearchById}
      className="p-2 ml-1  bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
      title="Search"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
    </button>
    {/* ♻️ Reset Button */}
  <button
    onClick={() => {
      setSearchId("");
      setFilters({
        status: "",
        category: "",
        rating: "",
        sort: "id",
        order: "asc",
        page: 1,
        limit: 5,
      });
      fetchCoaches();
    }}
    className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-2 rounded-md shadow-sm transition"
    title="Reset Filters"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582M20 20v-5h-.581M5 9a9 9 0 0114.36-3.64L20 9M19 15a9 9 0 01-14.36 3.64L4 15"
      />
    </svg>
    
  </button>
    
  </div>

  
</div>

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

      {/* 📄 Pagination Controls */}
      {!searchId && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={filters.page === 1}
            onClick={() => handlePageChange("prev")}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <p className="text-gray-700">
            Page {meta.page} of {meta.totalPages} ({meta.totalItems} total)
          </p>
          <button
            disabled={filters.page === meta.totalPages}
            onClick={() => handlePageChange("next")}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

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
