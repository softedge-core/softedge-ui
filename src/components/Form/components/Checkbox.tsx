import React from "react";
import { Check, Plus } from "lucide-react";

export interface CheckboxOption {
  value: string;
  label: string;
}

type Color = "cyan" | "blue" | "emerald" | "pink";

const colorClasses: Record<Color, string> = {
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  pink: "bg-pink-500",
};

export function CheckboxPillGroup({
  value = [],
  options,
  onChange,
  disabled = false,
  color = "cyan",
}: {
  value: string[];
  options: CheckboxOption[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  color?: Color;
}) {
  const toggle = (val: string) => {
    if (disabled) return;
    onChange(value.includes(val) ? value.filter(v => v !== val) : [...value, val]);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map(opt => {
        const selected = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            disabled={disabled}
            role="checkbox"
            aria-checked={selected}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              selected
                ? `${colorClasses[color]} text-white shadow-md`
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm",
              disabled ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span className="whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}