import React, { HTMLProps, useRef } from 'react'

type BarChartProps = {} & HTMLProps<HTMLDivElement>

const BarChart: React.FC<React.PropsWithChildren<BarChartProps>> = ({ ...p }) => {
  const ref = useRef<HTMLDivElement>(null)

  return <div {...p} ref={ref} />
}

export default BarChart
