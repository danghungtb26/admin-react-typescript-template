import React from 'react'

import OrdersTable from './components/orders-table'
import ProductsList from './components/products-list'
import RevenueChart from './components/revenue-chart'
import StatsRow from './components/stats-row'
import TeamProgress from './components/team-progress'
import VisitorsChart from './components/visitors-chart'
import VisitorsGauge from './components/visitors-gauge'

const AnalyticsDashboard = () => {
  return (
    <div className="relative bg-gray-50/50 p-6 space-y-6">
      {/* Stats Row */}
      <StatsRow />

      {/* Top Section: Visitors & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <VisitorsChart />
        </div>
        <div className="lg:col-span-2 h-[400px]">
          <RevenueChart />
        </div>
      </div>

      {/* Middle Section: Products, Team, Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProductsList />
        </div>
        <div className="lg:col-span-1">
          <TeamProgress />
        </div>
        <div className="lg:col-span-1">
          <VisitorsGauge />
        </div>
      </div>

      {/* Bottom Section: Orders Table */}
      <div>
        <OrdersTable />
      </div>
    </div>
  )
}

export default AnalyticsDashboard
