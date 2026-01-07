import { Link } from '@tanstack/react-router'
import { Edit, Trash } from 'lucide-react'
import React from 'react'

import TableSearch from './components/search'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table'
import { PageContainer } from '@/components/box/page-container'

type TableTemplateContainerProps = {}

const TableTemplateContainer: React.FC<
  React.PropsWithChildren<TableTemplateContainerProps>
> = () => {
  const data = [
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

  return (
    <PageContainer>
      <TableSearch />
      <div className="my-4" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[100px]">序号</TableHead>
              <TableHead className="text-center">标题</TableHead>
              <TableHead className="text-center">作者</TableHead>
              <TableHead className="text-center">阅读量</TableHead>
              <TableHead className="text-center">推荐指数</TableHead>
              <TableHead className="text-center">状态</TableHead>
              <TableHead className="text-center">时间</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell className="text-center font-medium">{item.id}</TableCell>
                <TableCell className="text-center">{item.title}</TableCell>
                <TableCell className="text-center">{item.author}</TableCell>
                <TableCell className="text-center">{item.readings}</TableCell>
                <TableCell className="text-center">{item.star}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={item.status === 'published' ? 'default' : 'destructive'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{item.date}</TableCell>
                <TableCell className="text-center">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  )
}

export default TableTemplateContainer
