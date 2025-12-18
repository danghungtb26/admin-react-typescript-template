import { Link, useLocation } from '@tanstack/react-router'
import { Breadcrumb as BreadcrumbAntd } from 'antd'
import { uniqBy } from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { findRouter, findRouterById } from '@/routers'
import { router_keys } from '@/routers/key'

const BreadcrumbStyled = styled.div`
  float: left;
  font-size: 1.4rem;
  line-height: 5rem;
  height: 100%;
  margin-left: 1.6rem;
  display: flex;
  align-items: center;
`

type BreadCrumbProps = {}

const BreadCrumb: React.FC<React.PropsWithChildren<BreadCrumbProps>> = () => {
  const location = useLocation()

  const items = useMemo(() => {
    const r = findRouter(location.pathname)
    const parent = r?.parent ? findRouterById(r.parent) : undefined
    const dashboard = findRouter(router_keys.dashboard)
    const items = []

    if (dashboard) {
      items.push({
        link: `/${dashboard.pathString}`,
        title: dashboard.meta?.title,
        titleKey: dashboard.meta?.titleKey,
      })
    }

    if (r) {
      if (parent) {
        items.push({
          link: `/${parent.pathString}`,
          title: parent.meta?.title,
          titleKey: parent.meta?.titleKey,
        })
      }
      items.push({
        link: `/${r.pathString}`,
        title: r.meta?.title,
        titleKey: r.meta?.titleKey,
      })
    }
    return uniqBy(items, 'link')
  }, [location.pathname])

  return (
    <BreadcrumbStyled>
      <BreadcrumbAntd
        items={items.map((i, id) => ({
          title:
            id === items.length - 1 ? (
              (i.title ?? i.link)
            ) : (
              <Link to={i.link}>{i.title ?? i.link}</Link>
            ),
        }))}
      />
    </BreadcrumbStyled>
  )
}

export default BreadCrumb
