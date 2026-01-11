import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { DataTable } from '@/components/molecules/data-table'
import { PageLayout } from '@/components/molecules/page-layout'

import TableSearch from './components/search'

type TableTemplateContainerProps = {}

type TableData = {
  id: number
  title: string
  author: string
  readings: number
  star: string
  status: string
  date: string
}

const data: TableData[] = [
  {
    id: 1,
    title: 'Admin Template',
    author: 'Hungdv',
    readings: 1203,
    star: '★★★★★',
    status: 'published',
    date: '2023-01-01',
  },
]

const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: 'id',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.id')
    },
    cell: ({ row }) => <div className="text-center font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: 'title',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.title')
    },
    cell: ({ row }) => <div className="text-center">{row.original.title}</div>,
  },
  {
    accessorKey: 'author',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.author')
    },
    cell: ({ row }) => <div className="text-center">{row.original.author}</div>,
  },
  {
    accessorKey: 'readings',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.readings')
    },
    cell: ({ row }) => <div className="text-center">{row.original.readings}</div>,
  },
  {
    accessorKey: 'star',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.star')
    },
    cell: ({ row }) => <div className="text-center">{row.original.star}</div>,
  },
  {
    accessorKey: 'status',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.status')
    },
    cell: ({ row }) => {
      const { t } = useTranslation()
      return (
        <div className="text-center">
          <Badge variant={row.original.status === 'published' ? 'default' : 'destructive'}>
            {row.original.status === 'published'
              ? t('template.table.status.published')
              : t('template.table.status.draft')}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.date')
    },
    cell: ({ row }) => <div className="text-center">{row.original.date}</div>,
  },
  {
    id: 'actions',
    header: () => {
      const { t } = useTranslation()
      return t('template.table.columns.actions')
    },
    cell: () => (
      <div className="flex items-center justify-center gap-2">
        <Link to="/template/table/1">
          <Button size="icon" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button size="icon" variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
  },
]

const TableTemplateContainer: React.FC<
  React.PropsWithChildren<TableTemplateContainerProps>
> = () => {
  return (
    <PageLayout>
      <TableSearch />
      <div className="my-4" />
      <DataTable columns={columns} data={data} />
    </PageLayout>
  )
}

export default TableTemplateContainer
