import React, { useState } from "react";

interface Option {
    value: string | number;
    label: string;
}

interface PaginationProps {
    options?: Option[];
    defaultValue?: string | number;
    onSelect?: (option: Option) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    options = [
        { value: 3, label: "3" },
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
    ],
    defaultValue = "5",
    onSelect,
}) => {
    const [selected, setSelected] = useState<string | number>(defaultValue);

    const handleSelect = (option: Option): void => {
        setSelected(option.value);
        onSelect?.(option);
    };

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                marginLeft:"-250px",
            }}
        >
            <span style={{ color: "gray-700"}}>Limits per page:</span>
            {options.map((option, index) => (
                <React.Fragment key={option.value}>
                    <span
                        onClick={() => handleSelect(option)}
                        style={{
                            cursor: "pointer",
                            userSelect: "none",
                            color: selected === option.value ? "#2563eb" : "#4b5563",
                            fontWeight: selected === option.value ? 600 : 400,
                        }}
                    >
                        {option.label}
                    </span>
                    {index < options.length - 1 && (
                        <span style={{ color: "#9ca3af" }}>|</span>
                    )}
                </React.Fragment>
            ))}
            
        </div>
    );
};

export default Pagination;
