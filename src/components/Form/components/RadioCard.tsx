import React from "react";

interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  value,
  label,
  description,
  icon,
  selected,
  disabled = false,
  onChange,
}) => {
  return (
    <label
      className={`relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 transition 
        ${selected ? "border-blue-600 ring-2 ring-blue-500/50 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* Hidden native radio input */}
      <input
        type="radio"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
        {icon}
      </div>

      {/* Texts */}
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-gray-900">{label}</div>
        {description && (
          <div className="mt-0.5 text-sm text-gray-600 line-clamp-2">{description}</div>
        )}
      </div>
    </label>
  );
};
