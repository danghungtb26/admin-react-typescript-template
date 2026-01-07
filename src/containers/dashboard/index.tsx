import { ChevronDown, FileText } from 'lucide-react'
import React from 'react'

import CountryStats from './components/country-stats'
import DeviceStats from './components/device-stats'
import LineChart from './components/line-chart'
import PanelGroup from './components/panel-group'
import RecentOrders from './components/recent-orders'
import SideStats from './components/side-stats'

import { Button } from '@/components/atoms/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'

type DashboardContainerProps = {}

const DashboardContainer: React.FC<React.PropsWithChildren<DashboardContainerProps>> = () => {
  return (
    <div className="relative bg-gray-50/50 p-6 space-y-6">
      {/* Stats Row */}
      <PanelGroup />

      {/* Revenue Component Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <LineChart />
        </div>
        <div className="lg:col-span-1">
          <SideStats />
        </div>
      </div>

      {/* Reports Overview Header */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-gray-800">Reports overview</h2>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-2 text-xs font-medium bg-white border-gray-200 text-gray-600"
              >
                <FileText className="size-3.5" /> Select data{' '}
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Data 1</DropdownMenuItem>
              <DropdownMenuItem>Data 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium cursor-pointer hover:text-indigo-600 transition-colors">
            Export data <ChevronDown className="size-3" />
          </div>
          <Button className="h-9 bg-[#d946ef] hover:bg-[#c026d3] text-white text-xs font-medium">
            Create report
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Device & Country */}
        <div className="lg:col-span-1 space-y-6">
          <div className="h-[380px]">
            <DeviceStats />
          </div>
          <div className="h-[300px]">
            <CountryStats />
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="lg:col-span-2 h-full min-h-[500px]">
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}

export default DashboardContainer
