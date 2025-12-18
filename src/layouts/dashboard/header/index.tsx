import BreadCrumb from '@components/breadcrumb'
import Hamburger from '@components/hamburger'
import { router_keys } from '@routers/key'
import { Link } from '@tanstack/react-router'
import { Avatar, Dropdown, Layout, MenuProps } from 'antd'
import React from 'react'
import styled from 'styled-components'

import { HEADER_HEIGHT } from '../constants'

const HeaderStyled = styled(Layout.Header)`
  height: ${HEADER_HEIGHT / 10}rem;
  background: #fff !important;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;
  padding: 0 2.4rem;
  position: relative;
`

const RightMenu = styled.div`
  float: right;
  display: flex;
  gap: 0.2rem;
  align-items: center;
  height: 100%;
`

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to={router_keys.profile}>Profile</Link>,
  },
]

type LayoutHeaderProps = {}

const LayoutHeader: React.FC<React.PropsWithChildren<LayoutHeaderProps>> = () => {
  return (
    <HeaderStyled>
      <Hamburger />
      <BreadCrumb />
      <RightMenu>
        <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
          <Avatar
            style={{ cursor: 'pointer' }}
            shape="square"
            size={40}
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
          />
        </Dropdown>
      </RightMenu>
    </HeaderStyled>
  )
}

export default LayoutHeader
