import React, { useEffect, useState } from "react";
import log from "../assets/log.jpeg";
import {
  getCoaches,
  addCoach,
  updateCoach,
  deleteCoach,
  getCoachById,
} from "../api/coachService";
import type { Coach } from "../types/coach";
import Pagination from "../components/Pagination";
import CoachForm from "../components/CoachForm";
import CoachTable from "../components/CoachTable";
import Filter from "../components/Filter";

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
  const [searchId, setSearchId] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(false); // ✅ Pagination loader

  // ---- Filter Options ----
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "id", label: "Sort by ID" },
    { value: "rating", label: "Sort by Rating" },
    { value: "name", label: "Sort by Name" },
  ];

  const orderOptions = [
    { value: "asc", label: "Ascending ↑" },
    { value: "desc", label: "Descending ↓" },
  ];

  const limitOptions = [3, 5, 10, 20].map((num) => ({
    value: num,
    label: `${num}`,
  }));

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // ✅ Fetch all coaches
  const fetchCoaches = async () => {
    try {
      const res = await getCoaches(filters);
      const { data, totalItems, totalPages, page } = res.data;
      setCoaches(data || []);
      setMeta({ totalItems, totalPages, page });

      // ✅ update unique categories dynamically
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
  }, [filters]);

  // ✅ Delete Coach
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this coach?")) return;
    setDeletingId(id);
    try {
      await deleteCoach(id);
      await fetchCoaches();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Add / Update Coach
  const handleSave = async (data: Partial<Coach>) => {
    try {
      if (editCoach) {
        await updateCoach(editCoach.id, data);
      } else {
        await addCoach(data as Coach);
      }

      // ✅ Add new category dynamically if needed
      if (data.category && !categories.includes(data.category)) {
        setCategories((prev) => [...prev, data.category!]);
      }

      setShowForm(false);
      setEditCoach(null);
      await fetchCoaches();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // ✅ Pagination with loader
  const handlePageChange = async (direction: "next" | "prev") => {
    setPageLoading(true);
    const newPage =
      direction === "next"
        ? Math.min(filters.page + 1, meta.totalPages)
        : Math.max(filters.page - 1, 1);

    setFilters((prev) => ({ ...prev, page: newPage }));
    await fetchCoaches();
    setPageLoading(false);
  };

  // ✅ Search by ID
  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchCoaches();
      return;
    }
    try {
      const res = await getCoachById(Number(searchId));
      setCoaches([res.data]);
      setMeta({ page: 1, totalPages: 1, totalItems: 1 });
    } catch (err) {
      setCoaches([]);
    }
  };

  return (
    <div className="p-6 relative min-h-screen">
      {/* 🧑‍🏫 Header */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={log}
          alt="CoachDesk Logo"
          className="w-12 h-12 rounded-full border border-gray-300 shadow-sm"
        />
        <h1 className="text-2xl font-bold text-blue-700 flex items-center">
          Coach Desk
        </h1>
      </div>

      {/* 🔍 Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Filter
          options={categoryOptions}
          defaultLabel="All Categories"
          onSelect={(opt) =>
            setFilters((prev) => ({
              ...prev,
              category: String(opt.value),
              page: 1,
            }))
          }
        />

        <Filter
          options={statusOptions}
          defaultLabel="All Status"
          onSelect={(opt) =>
            setFilters((prev) => ({
              ...prev,
              status: String(opt.value),
              page: 1,
            }))
          }
        />

        <Filter
          options={sortOptions}
          defaultLabel="Sort by ID"
          onSelect={(opt) =>
            setFilters((prev) => ({
              ...prev,
              sort: String(opt.value),
              page: 1,
            }))
          }
        />

        <Filter
          options={orderOptions}
          defaultLabel="Ascending ↑"
          onSelect={(opt) =>
            setFilters((prev) => ({
              ...prev,
              order: String(opt.value),
              page: 1,
            }))
          }
        />

        {/* ➕ Add Coach */}
        <button
          onClick={() => {
            setEditCoach(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Coach
        </button>

        {/* 🔎 Search by ID */}
        <div className="flex items-center border border-gray-300 rounded-lg bg-white px-2 gap-1 py-1 shadow-sm">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Search by ID"
            className="outline-none px-2 w-32 text-gray-700 placeholder-gray-400"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            onClick={handleSearchById}
            className="p-2 ml-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
            title="Search"
          >
            🔍
          </button>
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
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-2 rounded-md shadow-sm transition"
            title="Reset Filters"
          >
            ♻️
          </button>
        </div>
      </div>

      {/* 🧾 Table */}
      {coaches.length > 0 ? (
        <CoachTable
          coaches={coaches}
          onEdit={(coach) => {
            setEditCoach(coach);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          onStatusChange={async (id, newStatus) => {
            setLoadingId(id);
            try {
              await updateCoach(id, { status: newStatus });
              await fetchCoaches();
            } finally {
              setLoadingId(null);
            }
          }}
          loadingId={loadingId}
          deletingId={deletingId}
        />
      ) : (
        <p className="text-center text-gray-500 mt-10">No coaches found.</p>
      )}

      {/* 📄 Pagination */}
      {!searchId && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={filters.page === 1 || pageLoading}
            onClick={() => handlePageChange("prev")}
            className={`px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[90px] transition
              ${pageLoading ? "bg-gray-300 cursor-wait" : "bg-gray-200 hover:bg-gray-300"}
            `}
          >
            {pageLoading ? (
              <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "← Prev"
            )}
          </button>

          <p className="text-gray-700">
            Page {meta.page} of {meta.totalPages} ({meta.totalItems} total)
          </p>

          <Pagination
            options={limitOptions}
            defaultValue={5}
            onSelect={(opt) =>
              setFilters((prev) => ({
                ...prev,
                limit: Number(opt.value),
                page: 1,
              }))
            }
          />

          <button
            disabled={filters.page === meta.totalPages || pageLoading}
            onClick={() => handlePageChange("next")}
            className={`px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[90px] transition
              ${pageLoading ? "bg-gray-300 cursor-wait" : "bg-gray-200 hover:bg-gray-300"}
            `}
          >
            {pageLoading ? (
              <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Next →"
            )}
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
