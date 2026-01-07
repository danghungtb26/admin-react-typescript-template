import { Link, useMatches } from '@tanstack/react-router'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { uniqBy } from 'lodash'
import React, { useMemo } from 'react'

import {
  Breadcrumb as BaseBreadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/atoms/breadcrumb'
import { cn } from '@/lib/utils'

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
  transition: { duration: 0.3, ease: 'easeIn' },
}

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

  return (
    <div className="float-left text-sm leading-header h-full ml-4 flex items-center">
      <BaseBreadcrumb>
        <BreadcrumbList className="flex relative">
          {items.map((item, index) => (
            <React.Fragment key={item.link}>
              <BreadcrumbItem key={index}>
                <AnimatePresence mode="popLayout">
                  <motion.span {...animationConfig} className={cn('relative')}>
                    {index === items.length - 1 ? (
                      <span className="font-normal text-foreground">{item.title}</span>
                    ) : (
                      <Link to={item.link} className="hover:text-foreground transition-colors">
                        {item.title}
                      </Link>
                    )}
                  </motion.span>
                </AnimatePresence>
              </BreadcrumbItem>
              <BreadcrumbSeparator
                key={`separator-${item.link}`}
                className={cn(
                  index >= items.length - 1 ? 'opacity-0' : 'inline-flex',
                  'inline-flex transition-opacity duration-300 ease-in-out',
                )}
              >
                <motion.span {...animationConfig}>/</motion.span>
              </BreadcrumbSeparator>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BaseBreadcrumb>
    </div>
  )
}

export default BreadCrumb
