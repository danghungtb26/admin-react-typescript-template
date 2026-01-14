import { Loader2 } from 'lucide-react'
import React from 'react'

type LoadingCenterProps = {}

const LoadingCenter: React.FC<LoadingCenterProps> = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-loading">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default LoadingCenter
