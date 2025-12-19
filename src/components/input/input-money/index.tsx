import { InputNumber, InputNumberProps } from 'antd'
import React from 'react'

const InputVNDMoney: React.FC<InputNumberProps> = props => {
  return (
    <InputNumber
      {...props}
      className="w-full"
      formatter={(value: unknown) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value: unknown) => `${value}`.replace(/\$\s?|(,*)/g, '')}
      style={{ width: '100%' }}
    />
  )
}

export default InputVNDMoney
