import React from "react";
import { Search } from "lucide-react";
import IconX from "../icons/IconX";
import { Input } from "../../ui/input";

export function SearchInput({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (val: string) => void }) {
    return (
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari..."
          className="h-7 pl-9 pr-8 bg-white"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
          >
            <IconX className="text-gray-300 hover:text-gray-700 transition-colors duration-300" />
          </button>
        )}
      </div>
    )
  }