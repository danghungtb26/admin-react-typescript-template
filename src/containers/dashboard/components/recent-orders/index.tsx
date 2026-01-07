import { ChevronDown } from 'lucide-react'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table'

const ordersData = [
  { id: '#1532', date: 'Dec 30, 10:06 AM', status: 'Paid', total: '$ 329.80' },
  { id: '#1531', date: 'Dec 29, 2:50 AM', status: 'Pending', total: '$ 117.24' },
  { id: '#1530', date: 'Dec 20, 12:54 AM', status: 'Pending', total: '$ 52.16' },
  { id: '#1529', date: 'Dec 28, 2:32 PM', status: 'Paid', total: '$ 350.52' },
  { id: '#1528', date: 'Dec 27, 2:20 PM', status: 'Pending', total: '$ 240.79' },
  { id: '#1527', date: 'Dec 26, 9:49 AM', status: 'Paid', total: '$ 64.00' },
]

const RecentOrders = () => {
  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
        <CardTitle className="text-sm font-medium text-gray-700">Recent orders</CardTitle>
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
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent border-b-gray-100">
              <TableHead className="w-12 pl-6">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </TableHead>
              <TableHead className="text-gray-500 font-medium">Order</TableHead>
              <TableHead className="text-gray-500 font-medium">Date</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
              <TableHead className="text-gray-500 font-medium text-right pr-6">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map(order => (
              <TableRow key={order.id} className="border-b-gray-50 hover:bg-gray-50/50">
                <TableCell className="pl-6">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </TableCell>
                <TableCell className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-purple-500 rounded-sm"></div>
                    {order.id}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-xs">{order.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      order.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100 rounded-sm font-normal py-0'
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-100 rounded-sm font-normal py-0'
                    }
                  >
                    • {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 font-medium text-gray-700">
                  {order.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default RecentOrders
