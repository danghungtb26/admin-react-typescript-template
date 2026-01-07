import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { Badge } from '@/components/atoms/badge'
import { Card, CardContent, CardHeader } from '@/components/atoms/card'

const ProfitChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>(null)

  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current)
    chart.current.setOption({
      backgroundColor: 'transparent',
      grid: { top: 0, bottom: 0, left: 0, right: 0 },
      xAxis: {
        type: 'category',
        data: [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
        ],
        show: false,
      },
      yAxis: { type: 'value', show: false },
      series: [
        {
          type: 'bar',
          data: [10, 40, 30, 50, 40, 60, 70, 80, 60, 50, 70, 90, 80, 60, 40, 30, 50, 60],
          itemStyle: { color: '#ec4899', borderRadius: [2, 2, 0, 0] },
          barWidth: 6,
        },
      ],
    })
    return () => chart.current?.dispose()
  }, [])

  return (
    <Card className="border-none shadow-sm rounded-xl mb-6">
      <CardHeader className="pb-2 pt-6 px-6">
        <h3 className="text-sm font-medium text-gray-500">Total profit</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-900">$144.6K</span>
          <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100">28.5% ↗</Badge>
        </div>
      </CardHeader>
      <CardContent className="h-32 relative">
        <div ref={ref} className="w-full h-full" />
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
          <span>12 AM</span>
          <span>8 AM</span>
          <span>4 PM</span>
          <span>11 PM</span>
        </div>
      </CardContent>
    </Card>
  )
}

const SessionsChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>(null)

  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current)
    chart.current.setOption({
      backgroundColor: 'transparent',
      grid: { top: 10, bottom: 10, left: -10, right: -10 },
      xAxis: { type: 'category', show: false },
      yAxis: { type: 'value', show: false },
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: [10, 30, 20, 40, 20, 50, 30, 60, 50, 80, 40, 30, 10],
          itemStyle: { color: '#a855f7' },
          lineStyle: { width: 2, color: '#a855f7' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(168, 85, 247, 0.2)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0)' },
            ]),
          },
        },
      ],
    })
    return () => chart.current?.dispose()
  }, [])

  return (
    <Card className="border-none shadow-sm rounded-xl">
      <CardHeader className="pb-2 pt-6 px-6">
        <h3 className="text-sm font-medium text-gray-500">Total sessions</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-900">400</span>
          <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100">16.8% ↗</Badge>
        </div>
      </CardHeader>
      <CardContent className="h-32">
        <div ref={ref} className="w-full h-full" />
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
          <span>12 AM</span>
          <span>8 AM</span>
          <span>4 PM</span>
          <span>11 PM</span>
        </div>
      </CardContent>
    </Card>
  )
}

const SideStats = () => {
  return (
    <div className="flex flex-col h-full">
      <ProfitChart />
      <SessionsChart />
    </div>
  )
}

export default SideStats
