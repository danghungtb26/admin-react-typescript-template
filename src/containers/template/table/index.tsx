import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { PageContainer } from '@/components/box/page-container'
import { DataTable } from '@/components/molecules/data-table'

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
    header: '序号',
    cell: ({ row }) => <div className="text-center font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: 'title',
    header: '标题',
    cell: ({ row }) => <div className="text-center">{row.original.title}</div>,
  },
  {
    accessorKey: 'author',
    header: '作者',
    cell: ({ row }) => <div className="text-center">{row.original.author}</div>,
  },
  {
    accessorKey: 'readings',
    header: '阅读量',
    cell: ({ row }) => <div className="text-center">{row.original.readings}</div>,
  },
  {
    accessorKey: 'star',
    header: '推荐指数',
    cell: ({ row }) => <div className="text-center">{row.original.star}</div>,
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={row.original.status === 'published' ? 'default' : 'destructive'}>
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: '时间',
    cell: ({ row }) => <div className="text-center">{row.original.date}</div>,
  },
  {
    id: 'actions',
    header: '操作',
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
    <PageContainer>
      <TableSearch />
      <div className="my-4" />
      <DataTable columns={columns} data={data} />
    </PageContainer>
  )
}

export default TableTemplateContainer
