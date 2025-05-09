import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { cn } from "../../../lib/utils";

type GroupByType = {
  key: string;
  label: string;
  default?: boolean;
};

type GroupByPopoverProps = {
  options: GroupByType[];
  value: string | null;
  onChange: (val: string | null) => void;
};

export function GroupByPopover({ options, value, onChange }: GroupByPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    onChange?.('');
    setOpen(false);
  };

  const handleSelect = (val: string | null) => {
    onChange(val);
    setOpen(false);
  };

  const isValueEmpty = !value || value === '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn(
        "relative rounded-md bg-white shadow-sm",
        isValueEmpty ? "border border-gray-200" : "border border-sky-400"
      )}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="xs" className="flex items-center gap-2 rounded-md font-semibold">
            <span className="text-xs">
              {isValueEmpty ? "None" : options.find((a) => a.key === value)?.label}
            </span>
            <ChevronDown className="h-2 w-2" />
          </Button>
        </PopoverTrigger>

        {!isValueEmpty && (
          <Button
            className="absolute top-1.5 right-2 z-10"
            variant="outline2"
            size="xxs"
            onClick={handleClear}
          >
            <XMarkIcon className="h-2 w-2" />
          </Button>
        )}
      </div>

      <PopoverContent align="end" className="rounded-md bg-white p-2 shadow-lg border w-52" sideOffset={8}>
        <div className="space-y-1">
          <div
            className={cn(
              "hover:bg-gray-100 flex items-center justify-between text-xs cursor-pointer px-2 py-1 rounded-md",
              isValueEmpty ? "bg-sky-200 font-semibold" : ""
            )}
            onClick={() => handleSelect(null)}
          >
            <div>None</div>
          </div>
          <hr />
          {options.map((opt) => (
            <div
              key={opt.key}
              className={cn(
                "hover:bg-gray-100 flex items-center justify-between text-xs cursor-pointer px-2 py-1 rounded-md",
                value === opt.key ? "bg-sky-100 font-semibold" : ""
              )}
              onClick={() => handleSelect(opt.key)}
            >
              <div>{opt.label}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}