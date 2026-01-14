import * as echarts from 'echarts'
import { MoreHorizontal } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/atoms/card'

const DeviceStats = () => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>(null)

  useEffect(() => {
    if (!ref.current) return
    chart.current = echarts.init(ref.current, 'macarons')
    chart.current.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['50%', '70%'],
          startAngle: 180,
          endAngle: 360,
          avoidLabelOverlap: false,
          label: { show: false },
          data: [
            {
              value: 15624,
              name: t('dashboard.device_types.desktop'),
              itemStyle: { color: '#d946ef' },
            }, // Fuschia/Purple
            {
              value: 5546,
              name: t('dashboard.device_types.phone_app'),
              itemStyle: { color: '#8b5cf6' },
            }, // Purple
            {
              value: 2478,
              name: t('dashboard.device_types.laptop'),
              itemStyle: { color: '#3b82f6' },
            }, // Blue
          ],
        },
      ],
    })
    return () => chart.current?.dispose()
  }, [])

  return (
    <Card className="border-none shadow-sm rounded-xl h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <MoreHorizontal className="text-gray-400 size-5" />
      </div>
      <CardContent className="p-0 flex flex-col items-center justify-center pt-10">
        <div className="relative w-full h-48 flex justify-center">
          <div ref={ref} className="w-full h-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-center">
            <div className="text-3xl font-bold text-gray-900">23,648</div>
            <div className="text-xs text-gray-500">{t('dashboard.users_by_device')}</div>
          </div>
        </div>

        <div className="w-full px-8 pb-8 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="size-2 rounded-full bg-[#d946ef]" />
              {t('dashboard.device_types.desktop')}
            </div>
            <span className="font-bold text-gray-900">15,624</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="size-2 rounded-full bg-[#8b5cf6]" />
              {t('dashboard.device_types.phone_app')}
            </div>
            <span className="font-bold text-gray-900">5,546</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="size-2 rounded-full bg-[#3b82f6]" />
              {t('dashboard.device_types.laptop')}
            </div>
            <span className="font-bold text-gray-900">2,478</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DeviceStats
