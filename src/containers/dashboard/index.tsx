import React from 'react'

import LineChart from './components/line-chart'
import PanelGroup from './components/panel-group'
import { Container } from './styles'

type DashboardContainerProps = {}

const DashboardContainer: React.FC<React.PropsWithChildren<DashboardContainerProps>> = () => {
  return (
    <Container>
      <PanelGroup />
      <LineChart />
    </Container>
  )
}

export default DashboardContainer
