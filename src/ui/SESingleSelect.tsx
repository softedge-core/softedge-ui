import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";

type GroupByType = {
    value: string;
    label: string;
  };
  
  type GroupByPopoverProps = {
    options: GroupByType[];
    value: string | null;
    disable: boolean;
    onChange: (val: string | null) => void;
  };
  
  export function SESingleSelect({ options, value, disable, onChange }: GroupByPopoverProps) {
    const [open, setOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("Select")
    const handleSelect = (val: string | null) => {
        const selectedLabel = options.find((a) => a.value === val)?.label ?? "None";
        setSelectedLabel(selectedLabel);
      onChange(val);
      setOpen(false);
    };
  
    const isValueEmpty = !value || value === "";
  
    return (
      <Popover open={open && !disable} onOpenChange={setOpen}>
        <div
          className={cn(
            "relative w-fit rounded-md bg-white shadow-sm",
            isValueEmpty ? "border border-gray-200" : "border border-sky-400"
          )}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="default2"
              className="flex items-center gap-1 rounded-md font-semibold whitespace-nowrap"
              disabled={disable}
            >
              <span className="text-sm">{selectedLabel}</span>
              <ChevronDown className="h-2 w-2" />
            </Button>
          </PopoverTrigger>
        </div>
  
        <PopoverContent
          align="start"
          className="rounded-md bg-white p-2 shadow-lg border w-auto min-w-[8rem] max-w-xs"
          sideOffset={8}
        >
          <div className="space-y-1">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cn(
                  "hover:bg-gray-100 flex items-center justify-between text-base cursor-pointer px-2 py-1 rounded-md",
                  value === opt.value ? "bg-sky-100 font-semibold" : ""
                )}
                onClick={() => handleSelect(opt.value)}
              >
                <div>{opt.label}</div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
  
    // <Popover open={open} onOpenChange={setOpen}>
    //   <div className={cn(
    //     "relative flex rounded-md bg-white shadow-sm",
    //     isValueEmpty ? "border border-gray-200" : "border border-sky-400"
    //   )}>
    //     <PopoverTrigger asChild>
    //       <Button variant="outline" size="xs" className="inline-flex items-center gap-2 rounded-md font-semibold">
    //         <span className="text-xs">
    //           {isValueEmpty ? "None" : options.find((a) => a.key === value)?.label}
    //         </span>
    //         <ChevronDown className="h-2 w-2" />
    //       </Button>
    //     </PopoverTrigger>

    //     {!isValueEmpty && (
    //       <Button
    //         className="absolute top-1.5 right-2 z-10"
    //         variant="outline2"
    //         size="xxs"
    //         onClick={handleClear}
    //       >
    //         <XMarkIcon className="h-2 w-2" />
    //       </Button>
    //     )}
    //   </div>

    //   <PopoverContent align="start" className="rounded-md bg-white p-2 shadow-lg border w-auto max-w-xs" sideOffset={8}>
    //     <div className="space-y-1">
    //       {options.map((opt) => (
    //         <div
    //           key={opt.key}
    //           className={cn(
    //             "hover:bg-gray-100 flex items-center justify-between text-xs cursor-pointer px-2 py-1 rounded-md",
    //             value === opt.key ? "bg-sky-100 font-semibold" : ""
    //           )}
    //           onClick={() => handleSelect(opt.key)}
    //         >
    //           <div>{opt.label}</div>
    //         </div>
    //       ))}
    //     </div>
    //   </PopoverContent>
    // </Popover>
  );
}