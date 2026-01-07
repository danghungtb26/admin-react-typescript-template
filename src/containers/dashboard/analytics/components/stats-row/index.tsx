import { Heart, Package, ShoppingBag, DollarSign } from 'lucide-react'
import CountUp from 'react-countup'

import { Badge } from '@/components/atoms/badge'
import { Card, CardContent } from '@/components/atoms/card'
import { cn } from '@/lib/utils'

const statsData = [
  {
    title: 'Save Products',
    icon: Heart,
    value: 50800,
    prefix: '',
    suffix: 'K',
    decimals: 1,
    trend: '20.4%',
    trendUp: true,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    title: 'Stock Products',
    icon: ShoppingBag,
    value: 23600,
    prefix: '',
    suffix: 'K',
    decimals: 1,
    trend: '12.6%',
    trendUp: false,
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
  },
  {
    title: 'Sale Products',
    icon: Package,
    value: 756,
    prefix: '',
    suffix: '',
    decimals: 0,
    trend: '3.1%',
    trendUp: true,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  {
    title: 'Average Revenue',
    icon: DollarSign,
    value: 2300,
    prefix: '',
    suffix: 'K',
    decimals: 1,
    trend: '11.3%',
    trendUp: true,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
]

const StatsRow = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={cn('p-2 rounded-lg', stat.iconBg)}>
                <stat.icon className={cn('size-5', stat.iconColor)} />
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'rounded-sm px-1.5 py-0.5 text-xs font-normal',
                  stat.trendUp
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100'
                    : 'bg-rose-100 text-rose-600 hover:bg-rose-100',
                )}
              >
                {stat.trend}
                {stat.trendUp ? ' ↗' : ' ↘'}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">
                {stat.prefix}
                <CountUp
                  start={0}
                  end={stat.title === 'Sale Products' ? stat.value : stat.value / 1000}
                  decimals={stat.decimals}
                  separator=","
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm font-medium text-gray-500">{stat.title}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsRow
