import React from "react";
import IconX from "../icons/IconX";
import { Check } from "lucide-react";
import { ScrollArea } from "@/ui/scroll-area";

interface SingleOptionListProps {
  label: string;
  options: string[];
  value: string | null;
  onSelect: (value: string | null) => void;
  setOpen: (open: boolean) => void;
}

export const SingleOptionList = ({
  label,
  options,
  value,
  onSelect,
  setOpen,
}: SingleOptionListProps) => {
  const handleSelect = (val: string | null) => {
    onSelect(val);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex w-full items-start justify-between pb-2">
        <div className="text-xs text-slate-400">Filter by {label}</div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="right-0"
        >
          <IconX className="text-gray-300 hover:text-gray-700 transition-colors duration-300" />
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto pt-4">
      <ScrollArea>
        <div className="space-y-2">
          <div
            className={`flex items-center justify-between text-xs cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
              value === null ? "bg-gray-100 font-semibold" : ""
            }`}
            onClick={() => handleSelect(null)}
          >
            <span>All {label}</span>
            {value === null && <Check className="w-4 h-4 text-sky-600" />}
          </div>
          <hr />
          {options.map((opt) => (
            <div
              key={opt}
              className={`flex items-center justify-between text-xs  cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
                value === opt ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={() => handleSelect(opt)}
            >
              <span>{opt}</span>
              {value === opt && <Check className="w-4 h-4 text-sky-600" />}
            </div>
          ))}
        </div>
      </ScrollArea>
      </div>
      
    </div>
  );
};