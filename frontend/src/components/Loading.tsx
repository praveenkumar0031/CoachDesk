import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600 mt-3 font-medium">Loading data...</p>
      </div>
    </div>
  );
};

export default Loading;
