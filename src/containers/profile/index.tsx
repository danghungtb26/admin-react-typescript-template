import { PageContainer } from '@components/box/page-container'
import { Card, Col, Row, Tabs } from 'antd'
import React from 'react'

import AccountTab from './components/account'
import UserCard from './components/user-card'

type ProfileContainerProps = {}

const ProfileContainer: React.FC<React.PropsWithChildren<ProfileContainerProps>> = () => {
  return (
    <PageContainer>
      <Row gutter={20}>
        <Col xl={6} xs={24}>
          <UserCard />
        </Col>
        <Col xl={18} xs={24}>
          <Card>
            <Tabs
              items={[
                {
                  key: 'account',
                  children: <AccountTab />,
                  label: 'Account',
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default ProfileContainer
