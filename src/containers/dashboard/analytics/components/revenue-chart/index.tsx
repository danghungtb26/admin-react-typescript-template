import * as echarts from 'echarts'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader } from '@/components/atoms/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'

const RevenueChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>(null)

  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current)
    chart.current.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { show: false },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '5%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
        axisLabel: { formatter: '{value}K', color: '#9ca3af' },
      },
      series: [
        {
          name: 'Current clients',
          type: 'bar',
          stack: 'total',
          barWidth: 6,
          itemStyle: { color: '#d946ef', borderRadius: [0, 0, 0, 0] },
          data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90],
        },
        {
          name: 'Subscribers',
          type: 'bar',
          stack: 'total',
          barWidth: 6,
          itemStyle: { color: '#8b5cf6', borderRadius: [0, 0, 0, 0] },
          data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290],
        },
        {
          name: 'New customers',
          type: 'bar',
          stack: 'total',
          barWidth: 6,
          itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
          data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190],
        },
      ],
    })
    return () => chart.current?.dispose()
  }, [])

  useEffect(() => {
    const resize = () => chart.current?.resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Revenue by customer type</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">$240.8K</span>
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 font-normal">
                14.8% ↗
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#d946ef]" /> Current clients
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#8b5cf6]" /> Subscribers
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#3b82f6]" /> New
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1 text-xs font-normal bg-gray-50 border-gray-200"
                >
                  Jan 2024 - Dec 2024 <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>2024</DropdownMenuItem>
                <DropdownMenuItem>2023</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        <div ref={ref} className="w-full h-full" />
      </CardContent>
    </Card>
  )
}

export default RevenueChart
