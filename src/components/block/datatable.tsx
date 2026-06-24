"use client";

import { useEffect, useState } from "react";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/classname";

import { EmptyState } from "./empty-state";

export type DataTablePaginationState = { limit: number; page: number };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  total?: number;
  pagination?: DataTablePaginationState;
  setPagination?: (state: DataTablePaginationState) => void;
  notFound?: {
    title?: string;
    description?: string;
    action?: { label: string; onClick: () => void };
  };
  maxHeight?: number;
  className?: string;
  onRowClick?: (row: TData) => void;
  hidePagination?: boolean;
  disableLimitChange?: boolean;
  getCellProps?: (
    columnId: string,
    rowIndex: number,
    data: TData[]
  ) => (React.TdHTMLAttributes<HTMLTableCellElement> & { skip?: boolean }) | undefined;
  footerDualColumn?: boolean;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100];

function getPageNumbers(totalPages: number, pageIndex: number): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const current = pageIndex + 1; // 1-based
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < totalPages - 2) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  total = 0,
  pagination = { limit: 10, page: 1 },
  setPagination,
  notFound,
  maxHeight,
  className,
  onRowClick,
  getCellProps,
  hidePagination = false,
  disableLimitChange = false,
  footerDualColumn = false,
}: DataTableProps<TData, TValue>) {
  "use no memo";
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [lastTotal, setLastTotal] = useState(0);

  const { limit, page } = pagination;

  useEffect(() => {
    if (!loading && total != null) {
      queueMicrotask(() => setLastTotal(total));
    }
  }, [loading, total]);

  const displayTotal = loading ? lastTotal : (total ?? lastTotal);

  const hasPagination = typeof setPagination === "function" && !hidePagination;

  const pageIndex = page - 1;
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(displayTotal / limit)) : 1;

  const startItem = displayTotal === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, displayTotal);

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const goToPage = (index: number) => {
    if (!setPagination) return;
    setPagination({ ...pagination, page: index + 1 });
  };

  const setLimit = (newLimit: number) => {
    if (!setPagination) return;
    setPagination({ limit: newLimit, page: 1 });
  };

  const pageNumbers = getPageNumbers(totalPages, pageIndex);

  const getColumnSize = (columnDef: ColumnDef<TData, TValue>) => {
    const size = (columnDef as ColumnDef<TData, TValue> & { size?: number }).size;
    return size != null ? { width: size, minWidth: size } : undefined;
  };

  if (!table.getRowModel().rows?.length && !loading) {
    return (
      <EmptyState
        title={notFound?.title ?? "Tidak ada data"}
        subtitle={notFound?.description ?? "Belum ada data tersedia."}
        action={notFound?.action}
      />
    );
  }

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: number,
    canNavigate: boolean
  ) => {
    e.preventDefault();
    if (canNavigate) goToPage(targetPage);
  };

  const getPaginationClass = (isDisabled: boolean) =>
    cn("rounded-md border", isDisabled && "pointer-events-none opacity-50");

  return (
    <div
      className={cn(
        "flex w-full max-w-full min-w-0 flex-col rounded-xl bg-card border border-border shadow min-h-[550px]",
        className
      )}
    >
      <div
        className="overflow-x-auto flex-1"
        style={maxHeight ? { maxHeight: `${maxHeight}px`, overflowY: "auto" } : undefined}
      >
        <Table className="w-max min-w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sizeStyle = getColumnSize(header.column.columnDef);
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "text-muted-foreground rounded-2xl px-4 py-5 font-semibold uppercase",
                        maxHeight && "sticky top-0 z-10 bg-white"
                      )}
                      style={sizeStyle}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: limit }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {columns.map((col, colIndex) => {
                      const sizeStyle = getColumnSize(col);
                      return (
                        <TableCell key={colIndex} className="px-4 py-5" style={sizeStyle}>
                          <Skeleton className="h-10 w-full" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const sizeStyle = getColumnSize(cell.column.columnDef);
                      const cellProps = getCellProps?.(cell.column.id, rowIndex, data);
                      const { skip, className: extraClassName, ...restCellProps } = cellProps ?? {};
                      if (skip) return null;
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn("px-4 py-5", extraClassName)}
                          style={sizeStyle}
                          {...restCellProps}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div
          className={cn(
            "flex w-full flex-col justify-between gap-4 border-t px-4 py-5",
            footerDualColumn ? "items-start" : "items-stretch sm:flex-row sm:items-center"
          )}
        >
          {/* Limit Selector */}
          <div className="flex items-center gap-2">
            <Select
              value={`${limit}`}
              onValueChange={(value) => setLimit(Number(value))}
              disabled={disableLimitChange}
            >
              <SelectTrigger size="default" className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {ROWS_PER_PAGE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label
              htmlFor="rows-per-page"
              className="text-muted-foreground text-sm font-normal whitespace-nowrap"
            >
              Showing {startItem} - {endItem} of {displayTotal} results
            </Label>
          </div>

          {/* Pagination */}
          <Pagination className={footerDualColumn ? "justify-start" : "justify-end"}>
            <PaginationContent>
              {/* First Page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => handleNavigate(e, 0, hasPrevious)}
                  aria-disabled={!hasPrevious}
                  className={getPaginationClass(!hasPrevious)}
                >
                  <ChevronsLeft className="size-4" />
                </PaginationLink>
              </PaginationItem>

              {/* Previous Page */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => handleNavigate(e, pageIndex - 1, hasPrevious)}
                  aria-disabled={!hasPrevious}
                  className={getPaginationClass(!hasPrevious)}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => handleNavigate(e, (p as number) - 1, true)}
                      isActive={p === page}
                      className={cn(
                        "rounded-md border",
                        p === page &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next Page */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => handleNavigate(e, pageIndex + 1, hasNext)}
                  aria-disabled={!hasNext}
                  className={getPaginationClass(!hasNext)}
                />
              </PaginationItem>

              {/* Last Page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => handleNavigate(e, totalPages - 1, hasNext)}
                  aria-disabled={!hasNext}
                  className={getPaginationClass(!hasNext)}
                >
                  <ChevronsRight className="size-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
