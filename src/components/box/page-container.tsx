import React from 'react'

export const PageContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="relative p-8 bg-page-bg">{children}</div>
}
