import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TableGroupHeaderProps {
  groupName: string;
  expanded: boolean;
  onToggle: (groupName: string) => void;
  colSpan: number;
}

export function TableGroupHeader({
  groupName,
  expanded,
  onToggle,
  colSpan,
}: TableGroupHeaderProps) {
  return (
    <tr
      className="bg-gray-200 cursor-pointer sticky top-0 z-50"
      onClick={() => onToggle(groupName)}
    >
      <td colSpan={colSpan} className="p-1">
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {groupName}
        </div>
      </td>
    </tr>
  );
}