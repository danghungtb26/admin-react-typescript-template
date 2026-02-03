# Dashboard Screen Example

Complete implementation of an admin dashboard with metrics, charts, and summary tables.

## Structure

```
┌────────────────────────────────┐
│ Header + Date Filter           │
├────────────────────────────────┤
│ [Card] [Card] [Card] [Card]   │  ← Metrics
├────────────────────────────────┤
│ [Chart 1]        [Chart 2]    │  ← Visualizations
├────────────────────────────────┤
│ [Recent Activity Table]        │  ← Summary table
└────────────────────────────────┘
```

## Complete Example

```typescript
// pages/DashboardPage.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { startOfMonth, endOfDay } from 'date-fns'
import { MetricCard } from '@/components/organisms/metric-card'
import { ChartCard } from '@/components/organisms/chart-card'
import { DateRangePicker } from '@/components/molecules/date-range-picker'
import { LineChart } from '@/components/atoms/charts/line-chart'
import { BarChart } from '@/components/atoms/charts/bar-chart'
import { fetchDashboardMetrics, fetchChartData, fetchRecentOrders } from '@/apis/dashboard'

export function DashboardPage() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    startOfMonth(new Date()),
    endOfDay(new Date()),
  ])

  // Fetch metrics
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['dashboard', 'metrics', dateRange],
    queryFn: () => fetchDashboardMetrics({
      startDate: dateRange[0],
      endDate: dateRange[1],
    }),
  })

  // Fetch chart data
  const { data: chartData, isLoading: isLoadingCharts } = useQuery({
    queryKey: ['dashboard', 'charts', dateRange],
    queryFn: () => fetchChartData({
      startDate: dateRange[0],
      endDate: dateRange[1],
    }),
  })

  // Fetch recent orders
  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['dashboard', 'recent-orders'],
    queryFn: () => fetchRecentOrders({ limit: 10 }),
  })

  return (
    <div className="p-6">
      {/* Header with date filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          className="mt-4 md:mt-0"
        />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoadingMetrics ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(metrics?.totalRevenue || 0)}
              change={metrics?.revenueChange}
              trend={metrics?.revenueChange > 0 ? 'up' : 'down'}
              icon={<DollarIcon />}
              description="vs last period"
            />

            <MetricCard
              title="Total Orders"
              value={metrics?.totalOrders || 0}
              change={metrics?.ordersChange}
              trend={metrics?.ordersChange > 0 ? 'up' : 'down'}
              icon={<ShoppingCartIcon />}
              description="vs last period"
            />

            <MetricCard
              title="Active Users"
              value={metrics?.activeUsers || 0}
              change={metrics?.usersChange}
              trend={metrics?.usersChange > 0 ? 'up' : 'down'}
              icon={<UsersIcon />}
              description="vs last period"
            />

            <MetricCard
              title="Conversion Rate"
              value={`${metrics?.conversionRate || 0}%`}
              change={metrics?.conversionChange}
              trend={metrics?.conversionChange > 0 ? 'up' : 'down'}
              icon={<TrendingUpIcon />}
              description="vs last period"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Revenue Trend"
          description="Daily revenue over selected period"
          isLoading={isLoadingCharts}
        >
          {chartData?.revenue && (
            <LineChart
              data={chartData.revenue}
              xKey="date"
              yKey="amount"
              color="#3b82f6"
            />
          )}
        </ChartCard>

        <ChartCard
          title="User Growth"
          description="New users by day"
          isLoading={isLoadingCharts}
        >
          {chartData?.users && (
            <BarChart
              data={chartData.users}
              xKey="date"
              yKey="count"
              color="#10b981"
            />
          )}
        </ChartCard>
      </div>

      {/* Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Top Products"
          description="Best selling products"
          isLoading={isLoadingCharts}
        >
          {chartData?.topProducts && (
            <div className="space-y-4">
              {chartData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Order Status"
          description="Current order distribution"
          isLoading={isLoadingCharts}
        >
          {chartData?.orderStatus && (
            <div className="space-y-3">
              {chartData.orderStatus.map((status) => (
                <div key={status.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{status.label}</span>
                    <span className="font-medium">{status.count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(status.count / status.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/orders' })}
            >
              View All
            </Button>
          </div>
        </div>

        {isLoadingOrders ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar src={order.customer.avatar} size="sm" />
                        <div>
                          <div className="font-medium">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt, 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          navigate({ to: `/orders/${order.id}` })
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentOrders?.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No recent orders
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Metric card component
function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
}: {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down'
  icon?: React.ReactNode
  description?: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold">{value}</h3>

        {change !== undefined && (
          <span
            className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )
}

function MetricCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-1/2" />
    </div>
  )
}
```

## Key Features

1. **Multiple Data Sources**
   - Separate queries for metrics, charts, and tables
   - Independent loading states
   - Optimized for performance

2. **Date Filtering**
   - Date range picker affects all data
   - Consistent filter across dashboard
   - Default to current month

3. **Metric Cards**
   - Key performance indicators
   - Comparison with previous period
   - Trend indicators (up/down)
   - Icons for visual identification

4. **Visualizations**
   - Line chart for trends
   - Bar chart for comparisons
   - Progress bars for distributions
   - Ranked lists

5. **Summary Table**
   - Recent activity overview
   - Quick actions
   - Link to full list view

6. **Responsive Design**
   - Grid layout adapts to screen size
   - Mobile-friendly cards
   - Scrollable tables on small screens

## Simplified Version

```typescript
function SimpleDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  })

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div>Revenue: ${metrics?.revenue}</div>
        <div>Orders: {metrics?.orders}</div>
        <div>Users: {metrics?.users}</div>
        <div>Rate: {metrics?.rate}%</div>
      </div>

      <div>
        <h2>Revenue Chart</h2>
        <LineChart data={metrics?.chartData} />
      </div>

      <div>
        <h2>Recent Orders</h2>
        <RecentOrdersTable />
      </div>
    </div>
  )
}
```

## Related Patterns

- [List Screen](list-screen.md) - Drill down from dashboard metrics
- [Detail Screen](detail-screen.md) - View specific records
- [Data Flow](../data-flow.md) - Managing multiple queries
