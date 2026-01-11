import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Checkbox } from '@/components/atoms/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { DataTable } from '@/components/molecules/data-table'

type OrderData = {
  id: string
  date: string
  status: string
  total: string
}

const ordersData: OrderData[] = [
  { id: '#1532', date: 'Dec 30, 10:06 AM', status: 'Paid', total: '$ 329.80' },
  { id: '#1531', date: 'Dec 29, 2:50 AM', status: 'Pending', total: '$ 117.24' },
  { id: '#1530', date: 'Dec 20, 12:54 AM', status: 'Pending', total: '$ 52.16' },
  { id: '#1529', date: 'Dec 28, 2:32 PM', status: 'Paid', total: '$ 350.52' },
  { id: '#1528', date: 'Dec 27, 2:20 PM', status: 'Pending', total: '$ 240.79' },
  { id: '#1527', date: 'Dec 26, 9:49 AM', status: 'Paid', total: '$ 64.00' },
]

const columns: ColumnDef<OrderData>[] = [
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
          className="rounded border-gray-300 text-indigo-600"
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
          className="rounded border-gray-300 text-indigo-600"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: () => {
      const { t } = useTranslation()
      return t('dashboard.table.columns.order_id')
    },
    cell: ({ row }) => (
      <div className="font-semibold text-gray-700 flex items-center gap-2">
        <div className="size-2 bg-purple-500 rounded-sm"></div>
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: () => {
      const { t } = useTranslation()
      return t('dashboard.table.columns.date')
    },
    cell: ({ row }) => <div className="text-gray-500 text-xs">{row.original.date}</div>,
  },
  {
    accessorKey: 'status',
    header: () => {
      const { t } = useTranslation()
      return t('dashboard.table.columns.status')
    },
    cell: ({ row }) => {
      const { t } = useTranslation()
      return (
        <Badge
          variant="secondary"
          className={
            row.original.status === 'Paid'
              ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100 rounded-sm font-normal py-0'
              : 'bg-amber-100 text-amber-600 hover:bg-amber-100 rounded-sm font-normal py-0'
          }
        >
          •{' '}
          {row.original.status === 'Paid'
            ? t('dashboard.status.paid')
            : t('dashboard.status.pending')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'total',
    header: () => {
      const { t } = useTranslation()
      return t('dashboard.table.columns.total')
    },
    cell: ({ row }) => (
      <div className="text-right font-medium text-gray-700">{row.original.total}</div>
    ),
  },
]

const RecentOrders = () => {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
        <CardTitle className="text-sm font-medium text-gray-700">
          {t('dashboard.recent_orders')}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 gap-1 text-xs font-normal bg-gray-50 border-gray-200"
            >
              Jan 2024 <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Jan 2024</DropdownMenuItem>
            <DropdownMenuItem>Dec 2023</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0 [&_.space-y-4]:space-y-0">
        <DataTable
          columns={columns}
          data={ordersData}
          pageSizeOptions={[6, 10, 20]}
          showPagination={false}
        />
      </CardContent>
    </Card>
  )
}

export default RecentOrders
