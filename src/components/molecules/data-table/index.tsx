import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/atoms/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table'
import { Select } from '@/components/molecules/select'
import { cn } from '@/lib/utils'

/**
 * Pagination options for external (server-side) pagination
 */
export interface PaginationOptions {
  /**
   * Current page number (0-based)
   */
  pageIndex: number
  /**
   * Number of rows per page
   */
  pageSize: number
  /**
   * Total number of rows across all pages
   * Required for external pagination to calculate page count
   */
  total?: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  /**
   * Enable manual sorting (server-side sorting):
   * - false: Table handles sorting automatically (client-side)
   * - true: Parent component handles sorting (server-side)
   * @default false
   */
  manualSorting?: boolean
  /**
   * Row selection state (controlled)
   * If not provided, selection will be handled internally
   */
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  /**
   * Pagination options (controlled)
   * If not provided, pagination will be handled internally
   */
  pagination?: PaginationOptions
  onPaginationChange?: (pagination: PaginationOptions) => void
  /**
   * Enable manual pagination (server-side pagination):
   * - false: Table handles pagination automatically (client-side)
   * - true: Parent component handles pagination (server-side)
   * @default false
   */
  manualPagination?: boolean
  /**
   * Options for rows per page dropdown
   * @default [10, 20, 30, 40, 50]
   */
  pageSizeOptions?: number[]
  /**
   * Custom className for the container
   */
  className?: string
  /**
   * Show or hide pagination controls
   * @default true
   */
  showPagination?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  sorting,
  onSortingChange,
  manualSorting = false,
  rowSelection,
  onRowSelectionChange,
  pagination: controlledPagination,
  onPaginationChange,
  manualPagination = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  // Use internal state if pagination is not controlled
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const isPaginationControlled = controlledPagination !== undefined
  const paginationState: PaginationState = isPaginationControlled
    ? {
        pageIndex: controlledPagination.pageIndex,
        pageSize: controlledPagination.pageSize,
      }
    : internalPagination

  const handlePaginationChange: OnChangeFn<PaginationState> = updaterOrValue => {
    const newPagination =
      typeof updaterOrValue === 'function' ? updaterOrValue(paginationState) : updaterOrValue

    if (isPaginationControlled && onPaginationChange) {
      onPaginationChange({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
        total: controlledPagination.total,
      })
    } else {
      setInternalPagination(newPagination)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: !manualSorting ? getSortedRowModel() : undefined,
    onSortingChange,
    onPaginationChange: handlePaginationChange,
    ...(rowSelection && { onRowSelectionChange }),
    state: {
      sorting,
      pagination: paginationState,
      ...(rowSelection ? { rowSelection } : {}),
    },
    manualSorting,
    manualPagination,
    // For external pagination, we need to provide the total row count
    pageCount:
      manualPagination && controlledPagination?.total
        ? Math.ceil(controlledPagination.total / paginationState.pageSize)
        : undefined,
  })

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative rounded-md border">
        {loading && (
          <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            header.column.getCanSort() && 'cursor-pointer select-none',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ArrowUpIcon className="h-4 w-4" />,
                            desc: <ArrowDownIcon className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="even:bg-muted/40"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('data_table.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {manualPagination && controlledPagination?.total !== undefined && (
              <>
                {t('data_table.showing')} {paginationState.pageIndex * paginationState.pageSize + 1}{' '}
                {t('data_table.to')}{' '}
                {Math.min(
                  (paginationState.pageIndex + 1) * paginationState.pageSize,
                  controlledPagination.total,
                )}{' '}
                {t('data_table.of')} {controlledPagination.total} {t('data_table.rows')}
              </>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{t('data_table.rows_per_page')}</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={value => {
                  table.setPageSize(Number(value))
                }}
                options={pageSizeOptions.map(pageSize => ({
                  label: `${pageSize}`,
                  value: `${pageSize}`,
                }))}
                className="h-8 w-17.5"
                placeholder={table.getState().pagination.pageSize.toString()}
              />
            </div>
            <div className="flex w-25 items-center justify-center text-sm font-medium">
              {t('data_table.page')} {table.getState().pagination.pageIndex + 1}{' '}
              {t('data_table.of')} {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t('data_table.go_to_first_page')}</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t('data_table.go_to_previous_page')}</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t('data_table.go_to_next_page')}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t('data_table.go_to_last_page')}</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
