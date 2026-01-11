import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'

const CountryStats = () => {
  const { t } = useTranslation()

  const countryData = [
    { name: t('dashboard.countries.united_states'), users: '30%', color: 'bg-purple-600' },
    { name: t('dashboard.countries.united_kingdom'), users: '20%', color: 'bg-indigo-500' },
    { name: t('dashboard.countries.canada'), users: '20%', color: 'bg-blue-500' },
    { name: t('dashboard.countries.australia'), users: '15%', color: 'bg-sky-500' },
    { name: t('dashboard.countries.spain'), users: '15%', color: 'bg-cyan-500' },
  ]
  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6">
        <div>
          <CardTitle className="text-sm font-bold text-gray-700">
            {t('dashboard.users_by_country')}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold text-gray-900">12.4 K</span>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded-sm">
              28.5% ↗
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 cursor-pointer">
          {t('dashboard.export')} <ArrowRight className="size-3" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-6">
        {countryData.map(country => (
          <div key={country.name} className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{country.name}</span>
              <span>{country.users}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${country.color}`}
                style={{ width: country.users }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default CountryStats
