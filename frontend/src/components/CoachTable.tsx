import React from "react";
import type { Coach } from "../types/coach";
import RatingStars from "./RatingStars";
import StatusToggle from "./StatusToggle";

interface Props {
  coaches: Coach[];
  onEdit: (coach: Coach) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: "active" | "inactive") => void;
  loadingId?: number | null;
  deletingId?: number | null;
}

const CoachTable: React.FC<Props> = ({
  coaches,
  onEdit,
  onDelete,
  onStatusChange,
  loadingId,
  deletingId,
}) => {
  return (
    <div className="overflow-x-auto shadow ">
      <table className="min-w-full border border-gray-300 rounded-lg text-sm text-center bg-white">
        <thead className="bg-blue-100 text-gray-800">
          <tr>
            <th className="border px-4 py-3 font-bold">ID</th>
            <th className="border px-4 py-3 font-bold">Name</th>
            <th className="border px-4 py-3 font-bold">Email</th>
            <th className="border px-4 py-3 font-bold">Category</th>
            <th className="border px-4 py-3 font-bold">Rating</th>
            <th className="border px-4 py-3 font-bold">Status</th>
            <th className="border px-4 py-3 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coaches.length > 0 ? (
            coaches.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 transition border-t border-gray-200"
              >
                <td className="border px-4 py-2 text-gray-900">{c.id}</td>
                <td className="border px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                  {c.name}
                </td>
                <td className="border px-4 py-2 text-gray-900">{c.email}</td>
                <td className="border px-4 py-2 text-gray-900">{c.category}</td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center">
                    <RatingStars rating={c.rating} />
                  </div>
                </td>

                {/* ✅ Status Toggle */}
                <td className="border px-4 py-2">
                  <div className="flex justify-center">
                    <StatusToggle
                      status={c.status}
                      onToggle={() =>
                        onStatusChange(
                          c.id,
                          c.status === "active" ? "inactive" : "active"
                        )
                      }
                      loading={loadingId === c.id}
                    />
                  </div>
                </td>

                {/* ✅ Actions */}
                <td className="border px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(c.id)}
                      disabled={deletingId === c.id}
                      className={`px-3 py-1 rounded-md text-white text-sm w-20 flex justify-center items-center transition ${
                        deletingId === c.id
                          ? "bg-red-400 cursor-wait"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {deletingId === c.id ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="p-4 text-center text-red-500 font-medium border"
              >
                No coaches found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoachTable;
