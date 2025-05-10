import React from "react";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton = ({ columns, rows = 5 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="p-2 border-t">
              <div
                className="h-4 bg-gray-200 rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }} // Width random supaya lebih natural
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};