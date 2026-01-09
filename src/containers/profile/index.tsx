import React from 'react'

import { Card, CardContent } from '@/components/atoms/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { PageContainer } from '@/components/box/page-container'

import AccountTab from './components/account'
import UserCard from './components/user-card'

type ProfileContainerProps = {}

const ProfileContainer: React.FC<React.PropsWithChildren<ProfileContainerProps>> = () => {
  return (
    <PageContainer>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="col-span-1">
          <UserCard />
        </div>
        <div className="col-span-1 xl:col-span-3">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <AccountTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default ProfileContainer
