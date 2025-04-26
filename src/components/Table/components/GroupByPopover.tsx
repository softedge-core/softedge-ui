import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Switch } from "../../ui/switch";

export function GroupByPopover() {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="xs" className="flex items-center gap-1 rounded-md">
            <span>None</span>
            <ChevronDown className="h-2 w-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-md bg-white p-2 shadow-lg border w-52" sideOffset={8}>
        <div className="space-y-1">
          <div className={`hover:bg-gray-200 flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md }`}>
              <div>None</div>
          </div>
          <hr />
          <div className={`hover:bg-gray-200 flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md }`}>
              <div>Category</div>
          </div>
          <div className={`hover:bg-gray-200 flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md }`}>
              <div>Category 2</div>
          </div>
          <div className={`hover:bg-gray-200 flex items-center justify-between text-sm cursor-pointer px-2 py-1 rounded-md }`}>
              <div>Category 3</div>
          </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }