import React from "react";
import { Button } from "../../../ui/button";

interface AddNewButtonProps {
  title: string;
  onAddNew: () => void;
  icon?: React.ReactNode; // <-- tambahkan icon opsional
  children?: React.ReactNode;
}

export function AddNewButton({ title, onAddNew, icon }: AddNewButtonProps) {
  return (
    <div className="relative rounded-md shadow-sm border border-gray-200">
      <Button
        onClick={onAddNew}
        variant="outline"
        size="xs"
        className="flex items-center gap-2 rounded-md font-semibold text-xs"
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span>{title}</span>
      </Button>
    </div>
  );
}