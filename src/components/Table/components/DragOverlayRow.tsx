import React from "react";
import { cn } from "@/lib/utils";
import { GripVertical, MoreHorizontal } from "lucide-react";

interface DragOverlayRowProps {
  activeRow: Record<string, any> | null;
  columns: any[];
  visibleColumns: Record<string, boolean>;
  defaultColumn?: any;
}

export function DragOverlayRow({
  activeRow,
  columns,
  visibleColumns,
  defaultColumn,
}: DragOverlayRowProps) {
  if (!activeRow) return null;

  return (
    <tr className="bg-blue-50 text-blue-900 shadow-xl rounded-md w-full">
      {/* Grip column */}
      <td className="sticky left-0 bg-blue-50 w-[35px] pt-2 border-t border-blue-400">
        <GripVertical className="h-4 w-4 cursor-move" />
      </td>

      {/* Dynamic columns */}
      {columns
        .filter((col) => col.default || visibleColumns[col.key])
        .map((col) => (
          <td
            key={col.key}
            className={cn(
              'p-2 text-xs border-t border-blue-400',
              defaultColumn?.key === col.key ? 'w-auto' : ''
            )}
            style={{
              minWidth: defaultColumn?.key === col.key ? col.width : col.width,
              width: defaultColumn?.key === col.key ? 'auto' : col.width,
            }}
          >
            {Array.isArray(activeRow[col.key])
              ? (activeRow[col.key] as any[]).join(', ')
              : String(activeRow[col.key] ?? '')}
          </td>
        ))}

      {/* Action column */}
      <td className="sticky right-0 w-[35px] bg-blue-50 pt-2 border-t border-blue-400">
        <MoreHorizontal className="w-4 h-4" />
      </td>
    </tr>
  );
}