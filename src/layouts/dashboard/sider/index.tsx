import { useSetting } from '@contexts/setting/context'
import { useMobile } from '@hooks/media'
import { media_break_points } from '@themes/styled/globalStyle'
import { Layout } from 'antd'
import React from 'react'
import styled, { css } from 'styled-components'

import { ANIMATION_SPEED, SIDER_BAR_COLLAPSED_WIDTH, SIDER_BAR_WIDTH } from '../constants'

import Menu from './menu'

type LayoutSiderProps = {}

const SiderStyled = styled(Layout.Sider)<{ $open?: boolean }>`
  transition: width 0.28s;
  background-color: rgb(48, 65, 86) !important;
  height: 100%;
  position: fixed !important;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  overflow: hidden;
  overscroll-behavior: contain;

  .ant-menu {
    transition: all ${ANIMATION_SPEED}s;
  }

  ${media_break_points.xs} {
    transition-duration: 0.3s;
    transform: translate3d(-${SIDER_BAR_WIDTH / 10}rem, 0, 0);

    ${p =>
      p.$open
        ? css`
            transform: none;
          `
        : css`
            pointer-events: none;
          `}
  }
`

const DrawerBackground = styled.div`
  background: #000;
  opacity: 0.3;
  width: 100vw;
  top: 0;
  height: 100vh;
  position: absolute;
  z-index: 222;
`

const LayoutSider: React.FC<React.PropsWithChildren<LayoutSiderProps>> = () => {
  const { sidebarCollapsed, drawerOpened, toggleDrawerOpened } = useSetting()
  const mobile = useMobile()

  return (
    <>
      {drawerOpened && mobile ? <DrawerBackground onClick={toggleDrawerOpened} /> : null}
      <SiderStyled
        $open={drawerOpened}
        width={SIDER_BAR_WIDTH}
        collapsedWidth={SIDER_BAR_COLLAPSED_WIDTH}
        collapsed={!mobile && sidebarCollapsed}
        trigger={null}
      >
        <Menu />
      </SiderStyled>
    </>
  )
}

export default LayoutSider
