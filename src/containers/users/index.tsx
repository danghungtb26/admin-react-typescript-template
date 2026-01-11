import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUsers } from '@/apis/user/hooks/use-users'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import Avatar from '@/components/molecules/avatar'
import { DataTable, PaginationOptions } from '@/components/molecules/data-table'
import { PageLayout } from '@/components/molecules/page-layout'
import { User } from '@/models/user'

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const { t } = useTranslation()
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('common.actions.select_all')}
        />
      )
    },
    cell: ({ row }) => {
      const { t } = useTranslation()
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label={t('common.actions.select_row')}
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => {
      const { t } = useTranslation()
      return t('users.table.columns.name')
    },
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
    header: () => {
      const { t } = useTranslation()
      return t('users.table.columns.phone')
    },
  },
  {
    accessorKey: 'location',
    header: () => {
      const { t } = useTranslation()
      return t('users.table.columns.location')
    },
  },
  {
    accessorKey: 'company',
    header: () => {
      const { t } = useTranslation()
      return t('users.table.columns.company')
    },
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
    header: () => {
      const { t } = useTranslation()
      return t('users.table.columns.status')
    },
    cell: ({ row }) => {
      const { t } = useTranslation()
      return (
        <Badge
          variant={row.original.status === 'Online' ? 'default' : 'secondary'}
          className={
            row.original.status === 'Online'
              ? 'bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:text-green-400'
              : 'bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 dark:text-slate-400'
          }
        >
          {row.original.status === 'Online'
            ? t('common.status.online')
            : t('common.status.offline')}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { t } = useTranslation()

      return (
        <div className="flex items-center gap-2">
          <Link to="/users/$userId/edit" params={{ userId: row.original.id }}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t('common.button.edit')}</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('common.button.delete')}</span>
          </Button>
        </div>
      )
    },
  },
]

export default function UserList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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

  const query = useSearch({ strict: false })

  return (
    <PageLayout
      fullHeight
      spacing="lg"
      title={t('users.title')}
      description={t('users.description')}
      actions={
        <Link to="/users/create">
          <Button
            onClick={e => {
              e.preventDefault()
              navigate({ search: { ...query, createUser: true } })
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> {t('users.create_button')}
          </Button>
        </Link>
      }
    >
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
    </PageLayout>
  )
}
