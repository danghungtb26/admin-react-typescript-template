import { Link, useMatches } from '@tanstack/react-router'
import { Breadcrumb as BreadcrumbAntd } from 'antd'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { uniqBy } from 'lodash'
import React, { useMemo } from 'react'

import { cn } from '@/lib/utils'

type Props = React.ComponentProps<typeof BreadcrumbAntd>

type BreadCrumbProps = {}

const animationConfig: {
  initial: HTMLMotionProps<'span'>['initial']
  animate: HTMLMotionProps<'span'>['animate']
  exit: HTMLMotionProps<'span'>['exit']
  transition: HTMLMotionProps<'span'>['transition']
} = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.3, ease: 'linear' },
}

const separator = (
  <AnimatePresence mode="popLayout">
    <motion.span key="separator" {...animationConfig} className="inline-block relative">
      /
    </motion.span>
  </AnimatePresence>
)

const BreadCrumb: React.FC<React.PropsWithChildren<BreadCrumbProps>> = () => {
  const matches = useMatches()

  const items = useMemo(() => {
    // Get the last 2 matches, excluding layout routes (__root and _authenticated)
    const lastMatches = matches
      .filter(
        match =>
          !match.id.startsWith('__root') &&
          !match.id.startsWith('_authenticated') &&
          match.pathname !== '/',
      )
      .slice(-2)

    const uniqItems = uniqBy(
      [
        { link: '/dashboard', title: 'Dashboard', titleKey: 'dashboard', display: true },
        ...lastMatches.map(match => ({
          link: match.pathname,
          title: match.staticData?.meta?.title,
          titleKey: match.staticData?.meta?.titleKey,
          display: true,
        })),
      ],
      'link',
    )

    return uniqItems
  }, [matches])

  const renderedItems = useMemo<Props['items']>(() => {
    return items.map((i, id) => ({
      title: (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={i.link}
            {...animationConfig}
            className={cn('text-nowrap inline-block relative')}
          >
            {id === items.length - 1 ? (
              (i.title ?? i.link)
            ) : (
              <Link className="" to={i.link}>
                {i.title ?? i.link}
              </Link>
            )}
          </motion.span>
        </AnimatePresence>
      ),
      separator: null,
    }))
  }, [items])

  return (
    <div className="float-left text-sm leading-header h-full ml-4 flex items-center">
      <BreadcrumbAntd items={renderedItems} separator={separator} />
    </div>
  )
}

export default BreadCrumb
