import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import React from 'react'
import styled from 'styled-components'

import { useSetting } from '@/contexts/setting/context'
import { useMobile } from '@/hooks/media'

const Wrap = styled.div`
  line-height: 4.6rem;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-self: center;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`

type HamburgerProps = {}

const Hamburger: React.FC<React.PropsWithChildren<HamburgerProps>> = () => {
  const { sidebarCollapsed, toggleSidebarCollapsed, drawerOpened, toggleDrawerOpened } =
    useSetting()
  const mobile = useMobile()
  const cond = !mobile ? sidebarCollapsed : !drawerOpened
  const Component = cond ? MenuUnfoldOutlined : MenuFoldOutlined
  return (
    <Wrap>
      <Component onClick={mobile ? toggleDrawerOpened : toggleSidebarCollapsed} />
    </Wrap>
  )
}

export default Hamburger
