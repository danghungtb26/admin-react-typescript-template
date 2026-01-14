import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import Avatar from '@/components/molecules/avatar'

type UserCardProps = {}

const UserCard: React.FC<React.PropsWithChildren<UserCardProps>> = () => {
  return (
    <Card className="p-0">
      <CardHeader className="px-5 py-5 border-b border-gray-200 p-0">
        <CardTitle className="text-base font-medium">About me</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div>
          <div className="pt-2.5 mx-auto table">
            <Avatar
              src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
              fallback="User"
              className="w-[100px] h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCard
