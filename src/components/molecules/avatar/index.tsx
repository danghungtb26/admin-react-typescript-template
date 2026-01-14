import * as React from 'react'

import { Avatar as AvatarRoot, AvatarImage, AvatarFallback } from '@/components/atoms/avatar'
import { cn } from '@/lib/utils'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface AvatarProps {
  /** URL for the avatar image */
  src?: string
  /** Fallback text when image fails to load */
  fallback?: string
  /** Custom className for the root component */
  className?: string
  /** Size of the avatar (default: md) */
  size?: AvatarSize
  /** Whether to show rounded avatar (default: true) */
  rounded?: boolean
  /** Alt text for the image */
  alt?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
  xl: 'size-14 text-xl',
  '2xl': 'size-16 text-2xl',
}

const getFallbackText = (fallback?: string): string => {
  if (!fallback) return 'UN'

  // Split by spaces and filter empty strings
  const words = fallback.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return 'UN'
  if (words.length === 1) {
    // Single word: take first two characters
    return words[0].slice(0, 1).toUpperCase()
  }

  // Multiple words: take first character of first word and first character of last word
  const firstInitial = words[0][0]
  const lastInitial = words[words.length - 1][0]
  return (firstInitial + lastInitial).toUpperCase()
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  className,
  size = 'md',
  rounded = true,
  alt = 'Avatar',
}) => {
  const fallbackText = getFallbackText(fallback)

  return (
    <AvatarRoot
      className={cn(sizeClasses[size], rounded ? 'rounded-full' : 'rounded-md', className)}
    >
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback
        className={cn(
          'bg-primary/10 text-primary font-semibold',
          rounded ? 'rounded-full' : 'rounded-md',
        )}
      >
        {fallbackText}
      </AvatarFallback>
    </AvatarRoot>
  )
}

export default Avatar
