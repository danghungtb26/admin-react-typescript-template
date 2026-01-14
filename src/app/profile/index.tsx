import React from 'react'

import PageAnimation from '@/components/animation/page'
import ProfileContainer from '@/containers/profile'

type ProfilePageProps = {}

const ProfilePage: React.FC<React.PropsWithChildren<ProfilePageProps>> = () => {
  return (
    <PageAnimation>
      <ProfileContainer />
    </PageAnimation>
  )
}

export default ProfilePage
