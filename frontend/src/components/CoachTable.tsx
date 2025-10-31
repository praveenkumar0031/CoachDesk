import React from "react";
import type { Coach } from "../types/coach";
import RatingStars from "./RatingStars";
import StatusToggle from "./StatusToggle";

interface Props {
  coaches: Coach[];
  onEdit: (coach: Coach) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: "active" | "inactive") => void;
}

const CoachTable: React.FC<Props> = ({
  coaches,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <table className="w-full border rounded text-center">
      <thead className="bg-linear-to-r from-blue-100 to-indigo-100">
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Category</th>
          <th className="border p-2">Rating</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {coaches.length > 0 ? (
          coaches.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition">
              <td className="border p-2">{c.id}</td>
              <td className="border p-2 font-medium">{c.name}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.category}</td>
              <td className="border p-2">
                <RatingStars rating={c.rating} />
              </td>
              <td className="border p-2">
                <StatusToggle
                  status={c.status}
                  onToggle={() =>
                    onStatusChange(
                      c.id,
                      c.status === "active" ? "inactive" : "active"
                    )
                  }
                />
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="bg-indigo-500 text-white  px-3 py-1 rounded hover:bg-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="border-gray-500 p-4 text-red-500">
              No coaches found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CoachTable;
