import React from "react";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { cn } from "../../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../ui/dropdown-menu";

interface SortableRowProps {
  row: any;
  columns: any[];
  visibleColumns: Record<string, boolean>;
  defaultColumn?: any;
  backgroundColor?: string;
  highlightColor?: string;
  listeners: any;
  renderRowActions?: (row: any) => React.ReactNode;
}

export function SortableRow({
  row,
  columns,
  visibleColumns,
  defaultColumn,
  backgroundColor,
  highlightColor,
  listeners,
  renderRowActions,
}: SortableRowProps) {
  return (
    <>
      {/* Sticky Grip Column */}
      <td 
        className={cn(
          'sticky left-0 z-10 w-[35px] p-3 text-muted-foreground border-b border-r',
          backgroundColor ?? 'bg-white',
          backgroundColor ? 'border-slate-200' : 'border-slate-100',
          highlightColor ?? 'group-hover:bg-slate-50'
        )}
      >
        <GripVertical className="h-4 w-4 cursor-grab" {...listeners} />
      </td>

      {/* Dynamic Data Columns */}
      {columns.map((col, index) =>
        (col.default || visibleColumns[col.key]) ? (
          <td
            key={`${row.id}-${col.key}`}
            className={cn(
              'pl-2 text-xs border-b border-r',
              index === columns.length - 1 ? 'border-r-0' : '',
              backgroundColor ?? 'bg-white',
              highlightColor ?? 'group-hover:bg-slate-50',
              backgroundColor ? 'border-slate-200' : 'border-slate-100',
              defaultColumn?.key === col.key ? 'w-auto' : '',
              col.bold ? 'font-semibold' : 'font-normal'
            )}
            style={{
              minWidth: defaultColumn?.key === col.key ? col.width : col.width,
              width: defaultColumn?.key === col.key ? 'auto' : col.width,
            }}
          >
           {col.render
            ? col.render(row)
            : row[col.key]
          }
            {/* {Array.isArray(row[col.key as keyof typeof row])
              ? (row[col.key as keyof typeof row] as number[]).join(', ')
              : String(row[col.key as keyof typeof row] ?? '')} */}
          </td>
        ) : null
      )}

      {renderRowActions ? (
        <td
          className={cn(
            'sticky right-0 z-10 w-[35px] border-b border-l',
            backgroundColor ?? 'bg-white',
            highlightColor ?? 'group-hover:bg-slate-50',
            backgroundColor ? 'border-slate-200' : 'border-slate-100',
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-2 cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Ini cukup panggil 1x */}
              {renderRowActions(row) ?? (
                <div className="px-2 py-1 text-sm text-gray-500">No Actions</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      ) : null}
      
    </>
  );
}