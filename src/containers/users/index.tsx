import { useNavigate } from '@tanstack/react-router'
import { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useUsers } from '@/apis/user/hooks/use-users'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import Avatar from '@/components/molecules/avatar'
import { DataTable, PaginationOptions } from '@/components/molecules/data-table'
import { User } from '@/models/user'

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={row.original.avatar}
          fallback={row.original.name}
          size="sm"
          alt={row.original.name}
        />
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.company?.logo}
          alt={row.original.company?.name}
          className="h-5 w-5 object-contain"
        />
        <span>{row.original.company?.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'Online' ? 'default' : 'secondary'}
        className={
          row.original.status === 'Online'
            ? 'bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:text-green-400'
            : 'bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 dark:text-slate-400'
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const navigate = useNavigate()

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => navigate({ search: { eUserId: row.original.id } as any })}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
]

export default function UserList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationOptions>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: userResponse, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sorting: sorting as { id: string; desc: boolean }[],
  })

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your users for this month!</p>
        </div>
      </div>
      <DataTable
        data={userResponse?.data || []}
        columns={columns}
        loading={isLoading}
        sorting={sorting}
        manualSorting={true}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={{
          pageIndex: (userResponse?.meta?.current || 1) - 1,
          pageSize: userResponse?.meta?.limit || 10,
          total: userResponse?.meta?.total || 0,
        }}
        onPaginationChange={setPagination}
        manualPagination={true}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  )
}
