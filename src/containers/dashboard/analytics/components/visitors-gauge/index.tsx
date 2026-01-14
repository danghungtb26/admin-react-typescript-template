import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'

const VisitorsGauge = () => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>(null)

  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current)
    chart.current.setOption({
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 1,
          radius: '100%',
          center: ['50%', '75%'],
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [
                  0.8,
                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: '#d946ef' },
                    { offset: 0.5, color: '#8b5cf6' },
                    { offset: 1, color: '#3b82f6' },
                  ]),
                ],
                [1, '#f3f4f6'],
              ],
            },
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { show: false },
        },
      ],
    })
    return () => chart.current?.dispose()
  }, [])

  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-bold text-gray-800">
          {t('analytics.gauge.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] relative flex flex-col justify-end items-center pb-6">
        <div className="absolute top-0 left-0 w-full h-full">
          <div ref={ref} className="w-full h-full" />
        </div>
        <div className="relative text-center -mt-10">
          <div className="text-3xl font-bold text-gray-900">80%</div>
          <div className="text-xs text-gray-500">{t('analytics.gauge.transactions')}</div>
        </div>

        <div className="w-full flex justify-between px-2 mt-4 text-[10px] text-gray-400 font-medium tracking-wide uppercase">
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-purple-500" /> {t('analytics.gauge.sell')}
          </div>
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-blue-500" /> {t('analytics.gauge.distribute')}
          </div>
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-gray-300" /> {t('analytics.gauge.return')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VisitorsGauge
