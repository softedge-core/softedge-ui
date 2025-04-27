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
import clsx from 'clsx'
import React from 'react'
import CFDinamicDnDTablePagination from './components/SEDinamicDnDTablePagination'
import { TableSkeleton } from '../../ui/skeletonTable'
import { TableToolbar } from './components/TableToolbar'
import { TableHeader } from './components/TableHeader'
import { SortableRow } from './components/TableContent'
import { TableGroupHeader } from './components/TableGroupHeader'
import { TableGroupedHeader } from './components/TableGroupContent'
import { DragOverlayRow } from './components/DragOverlayRow'

type Column = {
  key: string
  label: string
  visible?: boolean
  width?: string,
  default?: boolean,
  bold?: boolean,
  render?: (row: any) => React.ReactNode
}

type GroupBy = {
  key: string
  label: string
}

type FilterConfig = {
  multipleSelection: boolean
}

function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type Props = {
  data?: any[];
  service?: () => Promise<any[]>;
  columns: Column[]
  filterKeys?: Record<string, FilterConfig>
  groupByKey?: GroupBy[]
  pageSize?: number
  height?: number
  backgroundColor?: string
  highlightColor?: string
  searchParams?: URLSearchParams
  setSearchParams?: (params: URLSearchParams) => void
  renderRowActions?: (row: any) => React.ReactNode
  addNewButton?: () => void
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

const groupBy = (items: any[], key: string) => {
  return items.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

export function SoftEdgeTable({ 
  data: initialData = [],
  service,
  columns, 
  filterKeys = {}, 
  groupByKey = [], 
  pageSize = 5, 
  height,backgroundColor, 
  highlightColor,
  searchParams, 
  setSearchParams, 
  renderRowActions,
  addNewButton
 }: Props) {
  const [data, setData] = useState<any[]>(initialData)
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
     return Object.fromEntries(columns.map((c) => [c.key, true]))
   })
  const activeRow = data.find((item) => item.id === activeId)
  const sensors = useSensors(useSensor(PointerSensor))
  const defaultColumn = columns.find((col) => col.default)
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGroupBy, setSelectedGroupBy] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction?: 'asc' | 'desc' }>({ key: '', direction: undefined });
  
  const fetchData = async () => {
    setLoading(true);
    try {
      if (service !== undefined) {
        const result = await service();
        setData(result);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    let items = [...data];

    // Search
    if (debouncedSearchTerm) {
      items = data.filter((item) =>
        columns.some((col) =>
          String(item[col.key] || "")
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }

    // setFilteredData(data);
    setCurrentPage(1); // Reset ke page 1 kalau search/sort berubah
  }, [debouncedSearchTerm, data]);


  const handleFilterChange = (field: string, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value ?? '',
    }))
  }
  
  
  function handleDragStart(event: any) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: any) {
    const { active, over } = event
    setActiveId(null)

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((i) => i.id === active.id)
      const newIndex = data.findIndex((i) => i.id === over.id)
      setData(arrayMove(data, oldIndex, newIndex))
    }
  }

  const handleSort = (key: string) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
    setCurrentPage(1); // optional
  };

  function toggleColumnVisibility(key: string) {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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

  
  const filteredSortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
  
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
  
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);


  const totalItems = filteredSortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedData.slice(start, start + pageSize);
  }, [filteredSortedData, currentPage]);

  const grouped = groupBy(paginatedData, selectedGroupBy);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  useEffect(() => {
    if (selectedGroupBy && Object.keys(expandedGroups).length === 0) {
      const initialExpanded: Record<string, boolean> = {};
      Object.keys(grouped).forEach((groupName) => {
        initialExpanded[groupName] = true;
      });
      setExpandedGroups(initialExpanded);
    }
  }, [selectedGroupBy, grouped]);

  return (
    <div className={`w-full ${backgroundColor ? backgroundColor : "bg-white"}`}>
      <TableToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterKeys={filterKeys}
        data={data}
        filters={filters}
        handleFilterChange={handleFilterChange}
        groupByKey={groupByKey}
        selectedGroupBy={selectedGroupBy}
        setSelectedGroupBy={setSelectedGroupBy}
        columns={columns}
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        addNewButton={addNewButton}
      />
      <div className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white relative" style={height !== undefined ? { height: `calc(100vh - ${height}px)` } : undefined}>
        <DndContext sensors={sensors}  collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <table className="table-auto w-full border-separate border-spacing-0">
            {selectedGroupBy === null || selectedGroupBy === '' || selectedGroupBy === undefined ? (
              <>
              <TableHeader columns={columns} visibleColumns={visibleColumns} defaultColumn={defaultColumn} 
                  backgroundColor={backgroundColor} handleSort={handleSort}
                  sortConfig={{
                    key: sortConfig.key,
                    direction: sortConfig.direction || 'asc',
                  }}
                  renderRowActions={renderRowActions}
                />
                <SortableContext items={paginatedData.map((row) => row.id)}>
                  <tbody>
                  { loading ? (
                      <TableSkeleton columns={columns.length + 2} rows={5} />
                  ) :
                    paginatedData.map((row) => (
                      <SortableItem key={row.id} id={row.id}>
                        {({ listeners }) => (
                          <SortableRow row={row} columns={columns} visibleColumns={visibleColumns} defaultColumn={defaultColumn} 
                            backgroundColor={backgroundColor} highlightColor={highlightColor}
                            listeners={listeners}
                            renderRowActions={renderRowActions} />
                        )}
                      </SortableItem>
                    )
                  )}
                  </tbody>
                </SortableContext>
              </>
            ) : (
              <tbody>
                {Object.entries(grouped).map(([groupName, items]) => (
                   <React.Fragment key={groupName}>
                      <TableGroupHeader groupName={groupName} expanded={expandedGroups[groupName]} onToggle={toggleGroup} colSpan={columns.length + 2} />
                      {expandedGroups[groupName] && (
                        <TableGroupedHeader columns={columns} visibleColumns={visibleColumns} defaultColumn={defaultColumn} backgroundColor={backgroundColor} handleSort={handleSort}
                          sortConfig={{ key: sortConfig.key, direction: sortConfig.direction || 'asc' }} />
                      )}

                      {expandedGroups[groupName] &&
                        (items as typeof data).map((row) => (
                          <SortableItem key={row.id} id={row.id}>
                            {({ listeners }) => (
                              <SortableRow
                                row={row} columns={columns} visibleColumns={visibleColumns} defaultColumn={defaultColumn} backgroundColor={backgroundColor}
                                highlightColor={highlightColor} listeners={listeners} renderRowActions={renderRowActions}
                              />
                            )}
                            </SortableItem>
                      ))}
                   </React.Fragment>
                ))}
              </tbody>
            )}
          </table>
          <DragOverlay>
            <DragOverlayRow activeRow={activeRow} columns={columns} visibleColumns={visibleColumns} defaultColumn={defaultColumn} />
          </DragOverlay>
        </DndContext>
        <CFDinamicDnDTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}