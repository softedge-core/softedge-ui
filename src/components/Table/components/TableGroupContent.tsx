import React from "react";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { ChevronSolidUp } from "../icons/ChevronUp";
import { ChevronSolidDown } from "../icons/ChevronDown";

interface TableGroupedHeaderProps {
  columns: any[];
  visibleColumns: Record<string, boolean>;
  defaultColumn?: any;
  backgroundColor?: string;
  handleSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
}

export function TableGroupedHeader({
  columns,
  visibleColumns,
  defaultColumn,
  backgroundColor,
  handleSort,
  sortConfig,
}: TableGroupedHeaderProps) {
  return (
    <tr className={cn('sticky top-8 z-40', backgroundColor ?? 'bg-white')}>
      {/* Grip Column */}
      <th
        className={cn(
          'sticky left-0 z-20 w-[35px] p-3 border-b top-8 bg-inherit',
          backgroundColor ? 'border-slate-200' : 'border-slate-100'
        )}
      >
        <GripVertical className="h-4 w-4 cursor-grab" />
      </th>

      {/* Data Columns */}
      {columns.map((col: any) =>
        (col.default || visibleColumns[col.key]) ? (
          <th
            key={col.key}
            className={cn(
              'text-left text-xs border-b font-normal sticky top-8 z-40 bg-inherit',
              backgroundColor ? 'border-slate-200' : 'border-slate-100',
              defaultColumn?.key === col.key ? 'w-auto' : ''
            )}
            style={{
              minWidth: col.width,
              width: defaultColumn?.key === col.key ? 'auto' : col.width
            }}
            onClick={() => handleSort(col.key)}
          >
            <div className="pl-3 pr-3 pt-1 pb-1 rounded-md flex items-center cursor-pointer hover:bg-slate-100">
              {col.label}
              {sortConfig.key === col.key ? (
                sortConfig.direction === 'asc' ? (
                  <div className="p-0">
                    <ChevronSolidUp className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="p-0">
                    <ChevronSolidDown className="h-5 w-5" />
                  </div>
                )
              ) : (
                <div className="p-0 h-5 w-5" />
              )}
            </div>
          </th>
        ) : null
      )}

      {/* Action Column */}
      <th
        className={cn(
          'sticky right-0 z-10 w-[35px] p-2 border-b top-8 bg-inherit',
          backgroundColor ? 'border-slate-200' : 'border-slate-100'
        )}
      />
    </tr>
  );
}