import React from "react";
import { Search } from "lucide-react";
import IconX from "../icons/IconX";
import { Input } from "@/ui/input";

export function SearchInput({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (val: string) => void }) {
    return (
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-black"
          >
            <IconX className="h-4 w-4 " />
          </button>
        )}
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="h-7 pl-8 pr-8 text-sm font-thin bg-white focus:ring-0 focus:ring-transparent"
      />
    </div>
    )
  }