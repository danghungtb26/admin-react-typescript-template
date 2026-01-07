import * as echarts from 'echarts'
import { ArrowDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'

const VisitorsChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>(null)

  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current)
    chart.current.setOption({
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: [
        {
          name: 'Visitors',
          type: 'pie',
          radius: ['70%', '85%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false },
          data: [
            { value: 150, name: 'Search', itemStyle: { color: '#d946ef' } }, // Fuschia
            { value: 50, name: 'Social', itemStyle: { color: '#8b5cf6' } }, // Purple
            { value: 30, name: 'Direct', itemStyle: { color: '#3b82f6' } }, // Blue
          ],
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
    <Card className="border-none shadow-sm rounded-xl h-full relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-gray-800">Website Visitors</CardTitle>
        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 cursor-pointer">
          Export <ArrowDown className="size-3" />
        </div>
      </CardHeader>
      <CardContent className="h-[300px] relative">
        <div ref={ref} className="w-full h-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-3xl font-bold text-gray-900">150k</div>
          <div className="text-xs text-gray-400 font-medium">Visitors</div>
        </div>

        <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[#d946ef]" /> Organic 30%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[#8b5cf6]" /> Social 50%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[#3b82f6]" /> Direct 20%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VisitorsChart
