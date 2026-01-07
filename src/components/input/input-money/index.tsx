import React from 'react'

import { Input } from '@/components/atoms/input'

const InputVNDMoney: React.FC<React.ComponentProps<typeof Input>> = props => {
  return <Input {...props} className="w-full" style={{ width: '100%' }} />
}

export default InputVNDMoney
