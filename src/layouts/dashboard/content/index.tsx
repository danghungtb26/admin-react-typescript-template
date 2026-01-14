import React from 'react'

type LayoutContentProps = {}

const LayoutContent: React.FC<React.PropsWithChildren<LayoutContentProps>> = ({ children }) => {
  return <main className="h-[calc(100%-100px)]">{children}</main>
}

export default LayoutContent
