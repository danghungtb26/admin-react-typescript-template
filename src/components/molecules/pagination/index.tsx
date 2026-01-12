import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/atoms/pagination'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  /**
   * Current page number (1-based)
   */
  currentPage: number
  /**
   * Total number of pages
   */
  totalPages: number
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void
  /**
   * Number of pages to show around current page
   * @default 1
   */
  siblingCount?: number
  /**
   * Custom className for the pagination container
   */
  className?: string
  /**
   * Show/hide previous and next buttons
   * @default true
   */
  showNavigationButtons?: boolean
}

/**
 * Pagination component that provides page navigation controls
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  showNavigationButtons = true,
}: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | 'ellipsis-start' | 'ellipsis-end')[] = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end of the range around current page
    const startPage = Math.max(2, currentPage - siblingCount)
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

    // Add ellipsis before range if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis-start')
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis after range if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis-end')
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page)
    }
  }

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        {showNavigationButtons && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={e => {
                e.preventDefault()
                if (canGoPrevious) {
                  handlePageClick(currentPage - 1)
                }
              }}
              className={cn(!canGoPrevious && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>
        )}

        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`${page}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={e => {
                  e.preventDefault()
                  handlePageClick(page)
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {showNavigationButtons && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={e => {
                e.preventDefault()
                if (canGoNext) {
                  handlePageClick(currentPage + 1)
                }
              }}
              className={cn(!canGoNext && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  )
}
