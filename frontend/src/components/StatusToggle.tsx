import React from "react";

interface Props {
  status: "active" | "inactive";
  onToggle: () => void;
  loading?: boolean;
}

const StatusToggle: React.FC<Props> = ({ status, onToggle, loading = false }) => {
  const active = status === "active";

  return (
    <button
      onClick={!loading ? onToggle : undefined}
      className={`px-3 py-1 rounded text-white w-24 flex justify-center items-center transition
        ${active ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"}
        ${loading ? "opacity-75 cursor-wait" : ""}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        active ? "Active" : "Inactive"
      )}
    </button>
  );
};

export default StatusToggle;
