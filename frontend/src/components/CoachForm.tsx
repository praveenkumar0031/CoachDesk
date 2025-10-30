import React, { useState } from "react";
import type { Coach } from "../types/coach";

interface Props {
  initialData?: Coach | null;
  onSubmit: (data: Partial<Coach>) => void;
  onClose: () => void;
}

const CoachForm: React.FC<Props> = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<Coach>>(
    initialData || { status: "active", rating: 0 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Coach" : "Add Coach"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={formData.rating || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoachForm;
