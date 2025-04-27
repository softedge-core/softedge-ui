import React from "react";
import { GripVertical, SlidersHorizontalIcon } from "lucide-react"
import { Button } from "../../../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { Switch } from "../../../ui/switch"

// Define or import ColumnType
type ColumnType = {
  key: string;
  label: string;
  default?: boolean;
};

// components/DisplayPopover.tsx
export function DisplayPopover({ columns, visibleColumns, toggleColumnVisibility }: {
    columns: ColumnType[],
    visibleColumns: Record<string, boolean>,
    toggleColumnVisibility: (key: string) => void
  }) {
    return (
      <div className="flex flex-wrap flex-col">
          <Popover>
            <div className="relative rounded-md bg-white shadow-sm border border-gray-200 bg-white text-slate-500 shadow-sm hover:bg-gray-50">
            <PopoverTrigger asChild>
              <Button size="xs" variant="outline" className="rounded-md w-full">
                <SlidersHorizontalIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            </div>
            <PopoverContent side="bottom" align="end" className="rounded-md bg-white p-2 shadow-lg border w-64" sideOffset={8}>
            <div className="flex w-full items-start justify-between pb-2">
              <div className="text-xs text-slate-400">Tampilkan Kolom</div>
            </div>
              <div className="space-y-1">
              {columns.map((col) => (
                <div key={col.key}
                  className={`hover:bg-gray-200 flex items-center justify-between text-xs cursor-pointer px-2 py-1 rounded-md }`}>
                  <div className="flex items-center gap-2">
                    <GripVertical className={`h-4 w-4 cursor-move ${col.default ? "text-slate-400" : ""}`} />
                    <label htmlFor={col.key} className={`text-xs ${col.default ? "text-slate-400" : ""}`}>{col.label}</label>
                  </div>
                  <Switch className="bg-sky-400 data-[state=checked]:bg-sky-400 data-[state=unchecked]:bg-gray-200"  id={col.key}
                        checked={visibleColumns[col.key]}
                        onCheckedChange={() => toggleColumnVisibility(col.key)}
                        disabled={col.default}
                    />
                </div>
              ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
    )
  }