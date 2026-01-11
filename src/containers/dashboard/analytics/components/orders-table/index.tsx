import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2, ChevronDown } from 'lucide-react'
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

type Order = {
  id: string
  client: string
  email: string
  date: string
  status: string
  country: string
  total: string
  color: string
}

const orders: Order[] = [
  {
    id: '#1532',
    client: 'John Carter',
    email: 'hello@johncarter.com',
    date: 'Jan 30, 2024',
    status: 'Delivered',
    country: 'United States',
    total: '$ 1,099.24',
    color: 'bg-indigo-600',
  },
  {
    id: '#1531',
    client: 'Sophie Moore',
    email: 'contact@sophiemoore.com',
    date: 'Jan 27, 2024',
    status: 'Canceled',
    country: 'United Kingdom',
    total: '$ 5,870.32',
    color: 'bg-purple-600',
  },
  {
    id: '#1530',
    client: 'Matt Cannon',
    email: 'info@mattcannon.com',
    date: 'Jan 24, 2024',
    status: 'Delivered',
    country: 'Australia',
    total: '$ 13,899.48',
    color: 'bg-pink-600',
  },
  {
    id: '#1529',
    client: 'Graham Hills',
    email: 'hi@grahamhills.com',
    date: 'Jan 21, 2024',
    status: 'Pending',
    country: 'India',
    total: '$ 1,569.12',
    color: 'bg-blue-600',
  },
  {
    id: '#1528',
    client: 'Sandy Houston',
    email: 'contact@sandyhouston.com',
    date: 'Jan 18, 2024',
    status: 'Delivered',
    country: 'Canada',
    total: '$ 599.16',
    color: 'bg-emerald-600',
  },
  {
    id: '#1527',
    client: 'Andy Smith',
    email: 'hello@andysmith.com',
    date: 'Jan 15, 2024',
    status: 'Pending',
    country: 'United States',
    total: '$ 2,449.64',
    color: 'bg-cyan-600',
  },
]

const columns: ColumnDef<Order>[] = [
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
      return t('analytics.orders.columns.order_id')
    },
    cell: ({ row }) => (
      <div className="font-semibold text-gray-700 font-mono text-xs">{row.original.id}</div>
    ),
  },
  {
    accessorKey: 'client',
    header: () => {
      const { t } = useTranslation()
      return t('analytics.orders.columns.customer')
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className={`size-8 rounded-full ${row.original.color} flex items-center justify-center text-white text-[10px] font-bold`}
        >
          {row.original.client.charAt(0)}
        </div>
        <div>
          <div className="text-xs font-bold text-gray-900">{row.original.client}</div>
          <div className="text-[10px] text-gray-500">{row.original.email}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: () => {
      const { t } = useTranslation()
      return t('analytics.orders.columns.date')
    },
    cell: ({ row }) => <div className="text-xs text-gray-500">{row.original.date}</div>,
  },
  {
    accessorKey: 'status',
    header: () => {
      const { t } = useTranslation()
      return t('analytics.orders.columns.status')
    },
    cell: ({ row }) => {
      const { t } = useTranslation()
      return (
        <Badge
          className={
            row.original.status === 'Delivered'
              ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100 shadow-none font-normal'
              : row.original.status === 'Pending'
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-100 shadow-none font-normal'
                : 'bg-rose-100 text-rose-600 hover:bg-rose-100 shadow-none font-normal'
          }
        >
          •{' '}
          {row.original.status === 'Delivered'
            ? t('analytics.orders.status.delivered')
            : row.original.status === 'Pending'
              ? t('analytics.orders.status.pending')
              : t('analytics.orders.status.canceled')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'country',
    header: () => {
      const { t } = useTranslation()
      return t('analytics.orders.columns.country')
    },
    cell: ({ row }) => (
      <div className="text-xs text-gray-600 font-medium">{row.original.country}</div>
    ),
  },
  {
    accessorKey: 'total',
    header: () => {
      const { t } = useTranslation()
      return t('analytics.orders.columns.total')
    },
    cell: ({ row }) => (
      <div className="text-xs font-bold text-gray-900 text-right">{row.original.total}</div>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: () => (
      <div className="flex justify-end gap-2 text-gray-400">
        <Edit2 className="size-3.5 hover:text-indigo-600 cursor-pointer" />
        <Trash2 className="size-3.5 hover:text-red-600 cursor-pointer" />
      </div>
    ),
    enableSorting: false,
  },
]

const OrdersTable = () => {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
        <CardTitle className="text-base font-bold text-gray-800">
          {t('analytics.orders.title')}
        </CardTitle>
        <div className="flex gap-2">
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
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="h-8 bg-[#d946ef] hover:bg-[#c026d3] text-white text-xs">
            Create order
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 [&_.space-y-4]:space-y-0">
        <DataTable
          columns={columns}
          data={orders}
          pageSizeOptions={[6, 10, 20]}
          showPagination={false}
        />
      </CardContent>
    </Card>
  )
}

export default OrdersTable
