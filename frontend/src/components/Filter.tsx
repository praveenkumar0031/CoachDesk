import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface FilterProps {
  options?: Option[];
  defaultLabel?: string;
  onSelect?: (option: Option) => void;
}

const Filter: React.FC<FilterProps> = ({
  options = [],
  defaultLabel = "Select Option",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(defaultLabel);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (): void => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option): void => {
    setSelectedValue(option.label);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-50">
      {/* 1️⃣ Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none hover:border-indigo-500"
      >
        {selectedValue}
      </button>

      {/* 2️⃣ Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-md shadow-lg bg-white">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`p-2 cursor-pointer hover:bg-indigo-500 hover:text-white ${
                selectedValue === option.label ? "bg-indigo-100" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
