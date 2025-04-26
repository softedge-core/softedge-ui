import { Check } from "lucide-react";
import IconX from "../icons/IconX";
import React from "react";

interface MultiOptionListProps {
  label: string;
  options: string[];
  value: string[]; // dari parent, controlled
  onSelect: (value: string[]) => void; // diatur dari parent (misalnya updateSearchParams)
  setOpen: (open: boolean) => void;
}

export const MultiOptionList = ({
  label,
  options,
  value,
  onSelect,
  setOpen,
}: MultiOptionListProps) => {
  const toggleOption = (val: string) => {
    const updated = new Set(value);
    if (updated.has(val)) {
      updated.delete(val);
    } else {
      updated.add(val);
    }
    onSelect(Array.from(updated));
  };

  const handleClearAll = () => {
    onSelect([]);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex w-full items-start justify-between pb-2">
        <div className="text-xs text-slate-400">Filter berdasarkan {label}</div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="right-0"
        >
          <IconX className="text-gray-300 hover:text-gray-700 transition-colors duration-300" />
        </button>
      </div>

      <div className="space-y-2">
        <div
          className={`flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
            value.length === 0 ? "bg-gray-100 font-semibold" : ""
          }`}
          onClick={handleClearAll}
        >
          <span>Semua {label}</span>
          {value.length === 0 && <Check className="w-4 h-4 text-blue-700" />}
        </div>
        <hr />
        {options.map((opt) => {
          const isSelected = value.includes(opt);
          return (
            <div
              key={opt}
              className={`flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
                isSelected ? "bg-blue-100 font-semibold text-blue-700" : ""
              }`}
              onClick={() => toggleOption(opt)}
            >
              <span>{opt}</span>
              {isSelected && <Check className="w-4 h-4 text-blue-700" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};