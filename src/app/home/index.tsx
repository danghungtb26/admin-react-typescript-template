import React from 'react'

import PageAnimation from '@/components/animation/page'
import HomeContainer from '@/containers/home'

type HomePageProps = {}

const HomePage: React.FC<React.PropsWithChildren<HomePageProps>> = () => {
  return (
    <PageAnimation>
      <HomeContainer />
    </PageAnimation>
  )
}

export default HomePage
