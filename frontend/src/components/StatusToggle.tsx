import React from "react";

interface Props {
  status: "active" | "inactive";
  onToggle: () => void;
}

const StatusToggle: React.FC<Props> = ({ status, onToggle }) => {
  const active = status === "active";

  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded text-white ${
        active ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
};

export default StatusToggle;
