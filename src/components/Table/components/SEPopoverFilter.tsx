import React, { useState, isValidElement, cloneElement } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";
import { Label } from "../../ui/label";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { MultiOptionList } from "./SEPopoverMultipleOption";
import { SingleOptionList } from "./SEPopoverSingleOption";

type CFPopoverFilterProps = {
  icon: React.ReactNode;
  label: string;
  options: string[];
  paramKey: string;
  multipleSelect?: boolean;
  value?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  searchParams?: URLSearchParams;
  setSearchParams?: (params: URLSearchParams) => void;
};

export const CFPopoverFilter = ({
  icon,
  label,
  options,
  paramKey,
  multipleSelect = false,
  value,
  onChange,
  searchParams,
  setSearchParams,
}: CFPopoverFilterProps) => {
  const [open, setOpen] = useState(false);

  const selected = multipleSelect
    ? searchParams?.getAll(paramKey) ?? []
    : searchParams?.get(paramKey) ?? null;

  const totalSelected = multipleSelect
    ? (selected as string[]).length
    : selected
    ? 1
    : 0;

  const updateSearchParams = (val: string[] | string | null) => {
    if (!searchParams || !setSearchParams) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(paramKey);

    if (val) {
      if (Array.isArray(val)) {
        val.forEach((v) => newParams.append(paramKey, v));
      } else {
        newParams.set(paramKey, val);
      }
    }

    setSearchParams(newParams);
  };

  const handleClear = () => {
    onChange?.(null);
    updateSearchParams(null);
    setOpen(false);
  };

  const formatLabel = (label: string) =>
    label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());

  // const clonedIcon = isValidElement(icon)
  //   ? cloneElement(icon, {
  //       className: `${
  //         icon.props.className ?? ""
  //       } ${totalSelected > 0 ? "text-sky-600 font-semibold" : "text-gray-500"}`,
  //     })
  //   : icon;

  return (
    <div className="flex flex-col">
      <div className="relative">
      <Label htmlFor="search" className="text-xs text-gray-500">
        {formatLabel(label)}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative rounded-md bg-white shadow-sm gap-2">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="xs"
              className={`z-0 flex items-center rounded-md relative ${
                totalSelected > 0
                  ? "border bg-sky-50 border-sky-600 font-semibold pr-8"
                  : "text-gray-600 bg-white gap-2"
              }`}
            >
              {/* {clonedIcon} */}
              <span>
                {multipleSelect
                  ? totalSelected > 0
                    ? `${totalSelected} Dipilih`
                    : "All"
                  : selected || "All"}
              </span>
              {totalSelected === 0 && <ChevronDown className="h-3 w-3" />}
            </Button>
          </PopoverTrigger>

          {totalSelected > 0 && (
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

        <PopoverContent
          align="start"
          className="bg-white p-2 rounded-md shadow-lg border w-52"
          sideOffset={8}
        >
          {multipleSelect ? (
            <MultiOptionList
              label={label}
              options={options}
              value={Array.isArray(value) ? value : []}
              onSelect={(val) => {
                onChange?.(val);
                updateSearchParams(val);
                setOpen(false);
              }}
              setOpen={setOpen}
            />
          ) : (
            <SingleOptionList
              label={label}
              options={options}
              value={typeof selected === "string" ? selected : null}
              onSelect={(val) => {
                onChange?.(val);
                updateSearchParams(val);
                setOpen(false);
              }}
              setOpen={setOpen}
            />
          )}
        </PopoverContent>
      </Popover>
      </div>
    </div>
  );
};

