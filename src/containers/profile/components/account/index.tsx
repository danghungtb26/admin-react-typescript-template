import React from 'react'

import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'

type AccountTabProps = {}

const AccountTab: React.FC<React.PropsWithChildren<AccountTabProps>> = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Email" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Username" />
      </div>
      <div>
        <Button type="button">Update</Button>
      </div>
    </div>
  )
}

export default AccountTab
