import { Spin } from 'antd'
import React from 'react'

type LoadingCenterProps = {}

const LoadingCenter: React.FC<LoadingCenterProps> = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-loading">
      <Spin />
    </div>
  )
}

export default LoadingCenter
