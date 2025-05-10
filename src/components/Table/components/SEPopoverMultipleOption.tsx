import { Check, Search } from "lucide-react";
import IconX from "../icons/IconX";
import React, { useState } from "react";
import { ScrollArea } from "@/ui/scroll-area";
import { Input } from "@/ui/input";

interface MultiOptionListProps {
  label: string;
  options: string[];
  value: string[]; // dari parent
  onSelect: (value: string[]) => void;
  setOpen: (open: boolean) => void;
}

export const MultiOptionList = ({
  label,
  options,
  value,
  onSelect,
  setOpen,
}: MultiOptionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter yang belum dipilih
  const filteredItems = options
    .filter(item => !value.includes(item))
    .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div className="flex w-full items-start justify-between">
        <div className="text-xs text-slate-400">Filter berdasarkan {label}</div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="right-0"
        >
          <IconX className="text-gray-300 hover:text-gray-700 transition-colors duration-300" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-sm text-xs mt-2">
        <div className="absolute inset-y-0 right-2 flex items-center">
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-black"
            >
              <IconX className="h-5 w-5" />
            </button>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari..."
          className="h-6 font-extralight bg-white focus:ring-0 focus:ring-transparent"
        />
      </div>

      {/* List */}
      <div className="max-h-[300px] overflow-y-auto pt-4">
        <ScrollArea>
          <div className="space-y-2">

            {/* Selected Items */}
            {value.length > 0 && (
              <>
                <div className="text-xs font-semibold text-slate-500 px-2">Terpilih</div>
                {value.map((selectedItem) => (
                  <div
                    key={selectedItem}
                    className="flex items-center justify-between text-sm px-2 py-1 rounded-md bg-blue-100 font-semibold text-blue-700 cursor-pointer"
                    onClick={() => toggleOption(selectedItem)}
                  >
                    <span className="text-xs">{selectedItem}</span>
                    <IconX className="w-4 h-4" />
                  </div>
                ))}
                <hr className="my-2" />
              </>
            )}

            {/* "Semua" Option */}
            <div
              className={`flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
                value.length === 0 ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={handleClearAll}
            >
              <span className="text-xs">Semua {label}</span>
              {value.length === 0 && <Check className="w-4 h-4 text-blue-700" />}
            </div>
            <hr />

            {/* Filtered Items */}
            {filteredItems.map((opt) => (
              <div
                key={opt}
                className="flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100"
                onClick={() => toggleOption(opt)}
              >
                <span className="text-xs font-semibold">{opt}</span>
                {/* Tidak ada icon Check di sini karena belum selected */}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};