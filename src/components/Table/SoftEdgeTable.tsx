'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { ChevronDown, ChevronUp, GripVertical, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { cn } from '../../lib/utils'
import clsx from 'clsx'
// import { CFPopoverFilter } from './CFPopoverFilter'
import { HomeIcon } from '@heroicons/react/20/solid'
import { Label } from '../ui/label'
import React from 'react'
// import CFDinamicDnDTablePagination from './CFDinamicDnDTablePagination'
import { SearchInput } from './components/SearchInput'
import { GroupByPopover } from './components/GroupByPopover'
import { DisplayPopover } from './components/DisplayPopover'
import { CFPopoverFilter } from './components/SEPopoverFilter'
import CFDinamicDnDTablePagination from './components/SEDinamicDnDTablePagination'
import PageTitle from './components/SEPageTitle'
import { ChevronSolidUp } from './icons/ChevronUp'
import { ChevronSolidDown } from './icons/ChevronDown'

type Column = {
  key: string
  label: string
  visible?: boolean
  width?: string,
  default?: boolean,
  bold?: boolean,
}

type FilterConfig = {
  multipleSelection: boolean
}

type Props = {
  data: Record<string, any>[]
  columns: Column[]
  filterKeys?: Record<string, FilterConfig>
  groupByKey?: string[]
  pageSize?: number
  multipleSelection?: boolean
  showActionColumn?: boolean
  height?: number
  backgroundColor?: string
  highlightColor?: string
  searchParams?: URLSearchParams
  setSearchParams?: (params: URLSearchParams) => void;
}

function SortableItem({ id, children }: { id: string; children: (props: { listeners: any }) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    background: isDragging ? '#f1f5f9' : undefined,
  }

  return (
    <tr className={
      clsx('transition-opacity', isDragging ? 
      'bg-white group relative z-0 hover:z-10 hover:bg-slate-50 transition-all opacity-0' : 'bg-white group relative z-0 hover:z-10 hover:bg-slate-50 transition-all opacity-100')} 
      ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </tr>
  )
}

export function SoftEdgeTable({ data, columns, filterKeys = {}, groupByKey = [], pageSize = 5, showActionColumn = true, height,backgroundColor, highlightColor, multipleSelection = false, searchParams, setSearchParams }: Props) {
  const [items, setItems] = useState(data)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
     return Object.fromEntries(columns.map((c) => [c.key, true]))
   })
  const activeRow = items.find((item) => item.id === activeId)

  const sensors = useSensors(useSensor(PointerSensor))
  const defaultColumn = columns.find((col) => col.default)
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (field: string, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value ?? '',
    }))
  }
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null,
  })
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  function handleDragStart(event: any) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: any) {
    const { active, over } = event
    setActiveId(null)

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  function handleSort(columnKey: string) {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        const nextDirection = prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc'
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        return { key: columnKey, direction: nextDirection }
      } else {
      setSortKey(prev.key);
      setSortDirection('asc');
      return { key: columnKey, direction: 'asc' }
      }
    })
  }

  // const handleSort = (key: keyof typeof data[0]) => {
  //   if (sortKey === key) {
  //     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortKey(key);
  //     setSortDirection('asc');
  //   }
  // };

  function toggleColumnVisibility(key: string) {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
            label={field}
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

  const applyFilters = (data: Record<string, any>[] , filters: Record<string, any>, filterKeys: Record<string, any>) => {
    return data.filter((item) => {
      return Object.entries(filterKeys).every(([key, config]) => {
        const filterValue = filters[key];
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
          return true;
        }
        const itemValue = item[key];
        
        if (config.multipleSelection) {
          const selectedValues = filterValue.map((value : any) => {
            return Array.isArray(value) ? value.map((v) => String(v)) : String(value);
          });
        
          return Array.isArray(itemValue)
            ? itemValue.some((val) => {
                const valStr = String(val);
                return selectedValues.some((selectedVal : any) => {
                  if (Array.isArray(selectedVal)) {
                    return selectedVal.includes(valStr);
                  }
                  return selectedVal === valStr;
                });
              })
            : selectedValues.some((selectedVal : any) => {
                const itemValStr = String(itemValue);
                if (Array.isArray(selectedVal)) {
                  return selectedVal.includes(itemValStr);
                }
                return selectedVal === itemValStr;
              });
        } else if (!config.multipleSelection) {
          const selectedValue = String(filterValue);
        
          if (Array.isArray(itemValue)) {
            return itemValue.some((val) => String(val) === selectedValue);
          }
          return String(itemValue) === selectedValue;
        }

      }) && Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const filteredData = applyFilters(data, filters, filterKeys);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);


  const totalPages = Math.ceil(filteredData.length / pageSize)
  
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);


  return (
    <>
    {/* {titleName !== "" && (
        <div className="pl-8 pr-8">
            <PageTitle titleName={titleName} />
        </div>
    )} */}
    <div className={`w-full ${backgroundColor ? backgroundColor : "bg-white"}`}>
      <div className="flex flex-wrap items-center justify-between pl-8 pr-8 pb-4">
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col shadow-sm">
              <div className="relative">
                <Label htmlFor="search" className="text-xs text-gray-500">Filter</Label>
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
            </div>
            {Object.keys(filterKeys).length > 0 && (
              <> {generateFilters(items, filterKeys, filters, handleFilterChange)} </>
            )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className='flex flex-col shadow-sm'>
            <div className="relative">
              <Label htmlFor="search" className="text-xs text-gray-500">Group By</Label>
              <GroupByPopover />
            </div>
          </div>
          <div className='flex flex-col shadow-sm'>
            <div className="relative">
              <Label htmlFor="search" className="text-xs text-gray-500">Display</Label>
              <DisplayPopover columns={columns} visibleColumns={visibleColumns} toggleColumnVisibility={toggleColumnVisibility} />
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white relative" style={height !== undefined ? { height: `calc(100vh - ${height}px)` } : undefined}>
        <DndContext sensors={sensors}  collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <table className="table-auto w-full border-separate border-spacing-0">
            {/* <thead 
              className={cn(
                'sticky top-0 z-20',
                backgroundColor ? backgroundColor : 'bg-white',
                backgroundColor ? 'border-slate-200' : 'border-slate-100 '
              )}>
              <tr>
                <th 
                  className={cn(
                    'sticky left-0 z-20 w-[35px] p-3 border-b',
                    backgroundColor ? backgroundColor : 'bg-white',
                    backgroundColor ? 'border-slate-200' : 'border-slate-100 '
                  )}>
                  <GripVertical className="h-4 w-4 cursor-grab"/>
                </th>
                {columns.map((col) =>
                  (col.default || visibleColumns[col.key]) ? (
                    <th
                      key={col.key}
                      className={cn(
                        'text-left text-xs border-b font-normal',
                        backgroundColor ? 'border-slate-200' : 'border-slate-100 ',
                        defaultColumn?.key === col.key ? `w-auto` : '',
                      )}
                      style={{
                        minWidth: defaultColumn?.key === col.key ? col.width : col.width,
                        width: defaultColumn?.key === col.key ? 'auto' : col.width 
                      }}
                    >
                      <div className='p-2 hover:bg-slate-100 rounded-md cursor-pointer'>
                      {col.label}
                      </div>
                    </th>
                  ) : null
                )}
                <th 
                 className={cn(
                  'sticky right-0 z-10 w-[35px] p-2 border-b',
                  backgroundColor ? backgroundColor : 'bg-white',
                  backgroundColor ? 'border-slate-200' : 'border-slate-100 '
                )}>
                </th>
              </tr>
            </thead> */}
             <thead
                className={cn(
                  'sticky top-0 z-20',
                  backgroundColor ? backgroundColor : 'bg-white',
                  backgroundColor ? 'border-slate-200' : 'border-slate-100'
                )}
              >
                <tr>
                  <th
                    className={cn(
                      'sticky left-0 z-20 w-[35px] p-3 border-b',
                      backgroundColor ? backgroundColor : 'bg-white',
                      backgroundColor ? 'border-slate-200' : 'border-slate-100'
                    )}
                  >
                    <GripVertical className="h-4 w-4 cursor-grab" />
                  </th>

                  {columns.map((col: any) =>
                    (col.default || visibleColumns[col.key]) ? (
                      <th
                        key={col.key}
                        className={cn(
                          'text-left text-xs border-b font-normal',
                          backgroundColor ? 'border-slate-200' : 'border-slate-100',
                          defaultColumn?.key === col.key ? 'w-auto' : ''
                        )}
                        style={{
                          minWidth: col.width,
                          width: defaultColumn?.key === col.key ? 'auto' : col.width
                        }}
                        onClick={() => handleSort(col.key)}
                      >
                        <div
                          className={cn(
                            'pl-3 pr-3 pt-1 pb-1 rounded-md flex items-center cursor-pointer hover:bg-slate-100',
                          )}
                        >
                          {col.label}
                          {sortConfig.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <div className='p-0'><ChevronSolidUp className="h-5 w-5" /></div>
                            ) : (
                              <div className='p-0'><ChevronSolidDown className="h-5 w-5" /></div>
                            )
                          ) : (
                            <div className='p-0 h-5 w-5'>
                            </div>
                          )}
                        </div>
                      </th>
                    ) : null
                  )}

                  <th
                    className={cn(
                      'sticky right-0 z-10 w-[35px] p-2 border-b',
                      backgroundColor ? backgroundColor : 'bg-white',
                      backgroundColor ? 'border-slate-200' : 'border-slate-100'
                    )}
                  />
                </tr>
              </thead>
            <SortableContext items={paginatedItems.map((row) => row.id)}>
              <tbody>
                {paginatedItems.map((row) => (
                  <SortableItem key={row.id} id={row.id}>
                    {({ listeners }) => (
                      <>
                        <td 
                        className={cn(
                          'sticky left-0 z-10 w-[35px] p-3 text-muted-foreground border-b border-r',
                          backgroundColor ? backgroundColor : 'bg-white',
                          backgroundColor ? 'border-slate-200' : 'border-slate-100 ',
                          highlightColor ? highlightColor : 'group-hover:bg-slate-50'
                        )}>
                          <GripVertical className="h-4 w-4 cursor-grab" {...listeners} />
                        </td>
                        {columns.map((col, index) =>
                          (col.default || visibleColumns[col.key]) ? (
                            <td
                              key={`${row.id}-${col.key}`}
                              className={cn(
                                'pl-2 text-xs border-b border-r',
                                index === columns.length - 1 ? 'border-r-0' : '',
                                backgroundColor ? backgroundColor : 'bg-white',
                                highlightColor ? highlightColor : 'group-hover:bg-slate-50',
                                backgroundColor ? 'border-slate-200' : 'border-slate-100 ',
                                defaultColumn?.key === col.key ? `w-auto` : '',
                                col.bold ? 'font-semibold' : 'font-normal'
                              )}
                              style={{ 
                                minWidth: defaultColumn?.key === col.key ? col.width : col.width,
                                width: defaultColumn?.key === col.key ? 'auto' : col.width 
                              }}
                            >
                              {Array.isArray(row[col.key as keyof typeof row])
                                ? (row[col.key as keyof typeof row] as number[]).join(', ')
                                : String(row[col.key as keyof typeof row] ?? '')}
                            </td>
                          ) : null
                        )}
                        <td 
                        className={cn(
                          'sticky right-0 z-10 w-[35px] border-b border-l',
                          backgroundColor ? backgroundColor : 'bg-white',
                          highlightColor ? highlightColor : 'group-hover:bg-slate-50',
                          backgroundColor ? 'border-slate-200' : 'border-slate-100 ',
                        )}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              {/* <Button size="icon" variant="ghost2"> */}
                                <div className='p-2'>
                                  <MoreHorizontal className="w-4 h-4" />
                                </div>
                              {/* </Button> */}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Detail</DropdownMenuItem>
                              <DropdownMenuItem>Archived</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </>
                    )}
                  </SortableItem>
                ))}
              </tbody>
            </SortableContext>
          </table>
          <DragOverlay>
            {activeRow ? (
              <tr className="bg-blue-50 text-blue-900 shadow-xl rounded-md w-full">
                {/* Sticky Left Grip Cell */}
                <td className="sticky left-0 bg-blue-50 w-[35px] pt-2 border-t border-blue-400">
                  <GripVertical className="h-4 w-4 cursor-move" />
                </td>

                {/* Dynamic columns */}
                {columns
                  .filter((col) => col.default || visibleColumns[col.key])
                  .map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'p-2 text-xs border-t border-blue-400',
                         defaultColumn?.key === col.key ? `w-auto` : ''
                      )}
                      style={{ 
                        minWidth: defaultColumn?.key === col.key ? col.width : col.width,
                        width: defaultColumn?.key === col.key ? 'auto' : col.width 
                      }}
                    >
                      {Array.isArray(activeRow[col.key])
                        ? activeRow[col.key].join(', ')
                        : String(activeRow[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="sticky right-0 w-[35px] bg-blue-50 pt-2 border-t border-blue-400">
                      <MoreHorizontal className="w-4 h-4" />
                  </td>
              </tr>
            ) : null}
          </DragOverlay>
        </DndContext>
        <CFDinamicDnDTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
    </>
  )
}