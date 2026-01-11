import { Smartphone, Watch } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'

const products = [
  { name: 'iPhone 14 Pro Max', stock: '524 in stock', price: '$ 1,099.00', icon: Smartphone },
  { name: 'Apple Watch S8', stock: '320 in stock', price: '$ 799.00', icon: Watch },
]

const ProductsList = () => {
  const { t } = useTranslation()

  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-bold text-gray-800">
          {t('analytics.products.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
          <span>{t('analytics.products.label')}</span>
          <span>Price</span>
        </div>
        {products.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <p.icon className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500">{p.stock}</div>
              </div>
            </div>
            <div className="text-sm font-bold text-gray-900">{p.price}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ProductsList
