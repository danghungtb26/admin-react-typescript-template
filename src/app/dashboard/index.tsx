import React from 'react'

import PageAnimation from '@/components/animation/page'
import DashboardContainer from '@/containers/dashboard'

type DashboardPageProps = {}

const DashboardPage: React.FC<React.PropsWithChildren<DashboardPageProps>> = () => {
  return (
    <PageAnimation>
      <DashboardContainer />
    </PageAnimation>
  )
}

export default DashboardPage
