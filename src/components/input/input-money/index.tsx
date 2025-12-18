import { InputNumber } from 'antd'
import { styled } from 'styled-components'

const InputVNDMoney = styled(InputNumber).attrs(() => {
  return {
    formatter: (value: unknown) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value: unknown) => `${value}`.replace(/\$\s?|(,*)/g, ''),
    style: { width: '100%' },
  }
})`
  width: 100%;
`

export default InputVNDMoney
