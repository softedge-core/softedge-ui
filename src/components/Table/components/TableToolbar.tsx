import React, { useState } from "react";
import { Label } from "../../../ui/label";
import { SearchInput } from "./SearchInput"; // atau ganti sesuai path SearchInput-mu
import { GroupByPopover } from "./GroupByPopover";
import { DisplayPopover } from "./DisplayPopover";
import { CFPopoverFilter } from "./SEPopoverFilter";
import { Home, HomeIcon, PlusCircle } from "lucide-react";
import { AddNewButton } from "./AddNewButton";
import { ViewToggleWithIcons } from "../../../ui/switchToggle";

interface TableToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterKeys: Record<string, any>;
  data: any[];
  filters: Record<string, any>;
  handleFilterChange: (key: string, value: any) => void;
  groupByKey: any[];
  selectedGroupBy: string;
  setSelectedGroupBy: (val: string) => void;
  columns: any[];
  visibleColumns: Record<string, boolean>;
  toggleColumnVisibility: (key: string) => void;
  searchParams?: URLSearchParams
  setSearchParams?: (params: URLSearchParams) => void;
  addNewButton?: () =>  void;
  addNewButtonTitle?: string;
  viewMode?: "grid" | "column" | undefined;
  onViewChange?: (value: "grid" | "column" | undefined) => void;
}

type FilterConfig = {
    multipleSelection: boolean
}

export function TableToolbar({
  searchTerm,
  setSearchTerm,
  filterKeys,
  data,
  filters,
  handleFilterChange,
  groupByKey,
  selectedGroupBy,
  setSelectedGroupBy,
  columns,
  visibleColumns,
  toggleColumnVisibility,
  searchParams, 
  setSearchParams, 
  addNewButton,
  addNewButtonTitle,
  viewMode,
  onViewChange
}: TableToolbarProps) {
    const generateFilters = (
        data: Record<string, any>[],
        fields: Record<string, FilterConfig>,
        filters: Record<string, any>,
        handleFilterChange: (field: string, value: any) => void
      ) => {
        return Object.entries(fields).map(([field, config]) => {
          const uniqueValues = Array.from(
            new Set(
              data
                .flatMap((item) =>
                  `${item[field]}`.split(",").map((v) => v.trim())
                )
                .filter((val) => val !== "")
            )
          );
      
          return (
            <div key={field} className="flex">
              <CFPopoverFilter
                icon={<HomeIcon className="h-3 w-3" />}
                label={columns.find((col) => col.key === field)?.label || field}
                options={uniqueValues}
                paramKey={field}
                value={
                  config.multipleSelection
                    ? Array.isArray(filters[field]) ? filters[field] : []
                    : typeof filters[field] === "string" ? filters[field] : null
                }
                onChange={(val) => handleFilterChange(field, val)}
                multipleSelect={config.multipleSelection}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          );
        });
      };

  return (
    <div className="flex flex-wrap items-center justify-between pl-8 pr-8 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col">
          <div className="relative">
            <Label htmlFor="search" className="text-xs text-gray-500">Filter</Label>
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>

        {Object.keys(filterKeys).length > 0 && (
          <> {generateFilters(data, filterKeys, filters, handleFilterChange)} </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {addNewButton && (
          <div className="flex flex-col">
            <div className="relative pt-6">
              <AddNewButton title={addNewButtonTitle || "Add New"} onAddNew={addNewButton} icon={<PlusCircle className="h-4 w-4"/>} />
            </div>
          </div>
        )}
        {viewMode === undefined || viewMode === "grid" ? (
          <>
            <div className="flex flex-col">
              <div className="relative">
                <Label htmlFor="group-by" className="text-xs text-gray-500">Group By</Label>
                <GroupByPopover
                  options={groupByKey}
                  value={selectedGroupBy}
                  onChange={(val) => val !== null && setSelectedGroupBy(val)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <Label htmlFor="display" className="text-xs text-gray-500">Display</Label>
                <DisplayPopover
                  columns={columns}
                  visibleColumns={visibleColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                />
              </div>
            </div>
          </>
        ) : (<></>)}
        {viewMode !== undefined && (
          <div className="flex flex-col">
            <div className="relative">
            <Label htmlFor="display" className="text-xs text-gray-500">View</Label>
            <ViewToggleWithIcons value={viewMode} onChange={onViewChange || (() => {})} />
            </div>
          </div>
        )} 
        
      </div>
    </div>
  );
}