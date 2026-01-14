import { Variants, motion } from 'framer-motion'
import React from 'react'

export const MOTION_VARIANTS: Variants = {
  initial: ({ direction }) => ({
    x: direction === 'backward' ? '-10%' : '10%',
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 1,
      delay: 0,
    },
  }),
  in: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 1,
      delay: 0,
    },
  },
  out: ({ direction }) => ({
    x: direction === 'backward' ? '10%' : '-10%',
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 1,
      delay: 0,
    },
  }),
}

type PageAnimationProps = {}

const PageAnimation: React.FC<React.PropsWithChildren<PageAnimationProps>> = ({ children }) => {
  return (
    <motion.div
      className="Page"
      custom={{ direction: 'forward' }}
      initial="initial"
      animate="in"
      exit="out"
      variants={MOTION_VARIANTS}
    >
      {children}
    </motion.div>
  )
}

export default PageAnimation
