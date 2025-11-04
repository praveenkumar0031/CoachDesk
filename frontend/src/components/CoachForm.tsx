import React, { useState } from "react";
import type { Coach } from "../types/coach";

interface Props {
  initialData?: Coach | null;
  onSubmit: (data: Partial<Coach>) => Promise<void> | void; // allow async
  onClose: () => void;
}

const CoachForm: React.FC<Props> = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<Coach>>(
    initialData || { status: "active", rating: 0, category: "General" }
  );

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false); // ✅ loading state for Save button

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "Other") {
        setIsCustomCategory(true);
        setFormData((prev) => ({ ...prev, category: "" }));
      } else {
        setIsCustomCategory(false);
        setFormData((prev) => ({ ...prev, category: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCategory(value);
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSubmit(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {initialData ? "Edit Coach" : "Add Coach"}
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name || ""}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={isCustomCategory ? "Other" : formData.category}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-3 rounded bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="General">General</option>
          <option value="Fitness">Fitness</option>
          <option value="Yoga">Yoga</option>
          <option value="Cricket">Cricket</option>
          <option value="Swimming">Swimming</option>
          <option value="Drawing">Drawing</option>
          <option value="Football">Football</option>
          <option value="Other">Other</option>
        </select>

        {/* Custom Category Field */}
        {isCustomCategory && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={handleCustomCategoryChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        )}

        {/* Rating */}
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={formData.rating || ""}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Status */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full mb-4 rounded bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-5 py-2 rounded text-white flex justify-center items-center transition w-28
              ${
                isSaving
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Save"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoachForm;
