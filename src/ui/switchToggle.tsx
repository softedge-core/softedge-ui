import React from "react"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { Grid2X2, LayoutGrid, LayoutList, Sheet } from "lucide-react"
import { cn } from "../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export function ViewToggleWithIcons({
  value,
  onChange,
}: {
  value: "grid" | "column"
  onChange: (value: "grid" | "column") => void
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val as "grid" | "column")
      }}
      className="flex flex-row -space-x-2 space gap-2 bg-white rounded-md border border-gray-200 shadow-sm"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="grid"
            aria-label="Grid View"
            className="aria-checked:bg-slate-400 h-7 w-4"
          >
            <Sheet className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-900 text-white p-2">Table view</TooltipContent> 
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
            <ToggleGroupItem
            value="column"
            aria-label="Column View"
            className="aria-checked:bg-slate-400 h-7 w-4"
          >
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-900 text-white p-2">Column view</TooltipContent> 
      </Tooltip>
    </ToggleGroup>
  )
}