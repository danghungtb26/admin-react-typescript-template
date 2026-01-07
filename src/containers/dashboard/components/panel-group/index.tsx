import { Eye, Star, User, UserPlus } from 'lucide-react'
import React from 'react'
import CountUp from 'react-countup'

import { Badge } from '@/components/atoms/badge'
import { Card, CardContent } from '@/components/atoms/card'
import { cn } from '@/lib/utils'

const chartList = [
  {
    type: 'Pageviews',
    icon: Eye,
    num: 50800,
    prefix: '',
    suffix: 'K',
    decimals: 1,
    trend: '20.4%',
    trendUp: true,
  },
  {
    type: 'Monthly users',
    icon: User,
    num: 23600,
    prefix: '',
    suffix: 'K',
    decimals: 1,
    trend: '-12.0%',
    trendUp: false,
  },
  {
    type: 'New sign ups',
    icon: UserPlus,
    num: 756,
    prefix: '',
    suffix: '',
    decimals: 0,
    trend: '3.1%',
    trendUp: true,
  },
  {
    type: 'Subscriptions',
    icon: Star,
    num: 2300,
    prefix: '',
    suffix: 'K',
    decimals: 1,
    trend: '11.3%',
    trendUp: true,
  },
]

type PanelGroupProps = {}

const PanelGroup: React.FC<React.PropsWithChildren<PanelGroupProps>> = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {chartList.map((chart, index) => (
        <Card key={index} className="border-none shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <chart.icon className="size-4" /> {chart.type}
              </span>
              <div className="text-gray-400">...</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-gray-900">
                {chart.prefix}
                <CountUp
                  start={0}
                  end={chart.type === 'New sign ups' ? chart.num : chart.num / 1000}
                  decimals={chart.decimals}
                  separator=","
                  suffix={chart.suffix}
                />
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'rounded-sm px-1.5 py-0.5 text-xs font-normal',
                  chart.trendUp
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100'
                    : 'bg-rose-100 text-rose-600 hover:bg-rose-100',
                )}
              >
                {chart.trend}
                {chart.trendUp ? ' ↗' : ' ↘'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PanelGroup
