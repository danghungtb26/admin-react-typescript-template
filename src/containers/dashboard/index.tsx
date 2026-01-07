import React from 'react'

import LineChart from './components/line-chart'
import PanelGroup from './components/panel-group'

type DashboardContainerProps = {}

const DashboardContainer: React.FC<React.PropsWithChildren<DashboardContainerProps>> = () => {
  return (
    <div className="relative bg-page-bg p-8">
      <PanelGroup />
      <LineChart />
    </div>
  )
}

export default DashboardContainer
