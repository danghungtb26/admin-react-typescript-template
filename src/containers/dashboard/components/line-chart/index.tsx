import * as echarts from 'echarts'
import { debounce } from 'lodash'
import { ChevronDown } from 'lucide-react'
import React, { HTMLProps, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader } from '@/components/atoms/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { useSetting } from '@/contexts/setting/context'

type LineChartProps = {} & HTMLProps<HTMLDivElement>

const LineChart: React.FC<React.PropsWithChildren<LineChartProps>> = ({ ...p }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts | null>(null)
  const { sidebarCollapsed } = useSetting()

  useEffect(() => {
    const initChart = () => {
      if (!ref.current) return

      chart.current = echarts.init(ref.current)

      chart.current.setOption({
        backgroundColor: 'transparent',
        grid: {
          left: '2%',
          right: '2%',
          bottom: '5%',
          top: '10%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#9ca3af' },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}K',
            color: '#9ca3af',
          },
          splitLine: {
            lineStyle: { color: '#f3f4f6' },
          },
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: 'Revenue',
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: { color: '#8b5cf6' }, // Purple
            lineStyle: { width: 3 },
            data: [50, 80, 60, 120, 150, 180, 160, 200, 220, 210, 230, 240],
            markPoint: {
              data: [
                {
                  coord: [5, 180],
                  value: '$125.2k',
                  itemStyle: { color: '#8b5cf6' },
                  label: {
                    show: true,
                    position: 'top',
                    backgroundColor: '#8b5cf6',
                    color: '#fff',
                    padding: [4, 8],
                    borderRadius: 4,
                    formatter: '$125.2k',
                  },
                },
              ],
              symbol: 'circle',
              symbolSize: 6,
            },
          },
          {
            name: 'Expenses',
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: { color: '#3b82f6' }, // Blue
            lineStyle: { width: 3 },
            data: [30, 50, 40, 70, 90, 100, 80, 110, 130, 120, 140, 160],
          },
        ],
      })
    }

    initChart()

    return () => {
      chart.current?.dispose()
    }
  }, [])

  useEffect(() => {
    const resize = debounce(() => chart.current?.resize(), 300)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      chart.current?.resize()
    }, 300)
  }, [sidebarCollapsed])

  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="pb-0 pt-6 px-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('dashboard.total_revenue')}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">$240.8K</span>
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100">
                24.6% ↗
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-purple-500"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <span>Expenses</span>
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
        <div className="w-full h-full" {...p} ref={ref} />
      </CardContent>
    </Card>
  )
}

export default LineChart
