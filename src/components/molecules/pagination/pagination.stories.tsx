import { useState } from 'react'

import { Pagination } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const [currentPage, setCurrentPage] = useState(context.args.currentPage || 1)

      return (
        <div className="space-y-4">
          <Story args={{ ...context.args, currentPage, onPageChange: setCurrentPage }} />
          <p className="text-sm text-muted-foreground text-center">
            Current page: {currentPage} / {context.args.totalPages}
          </p>
        </div>
      )
    },
  ],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page (1-based)',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Number of pages to show on each side of current page',
    },
    showNavigationButtons: {
      control: 'boolean',
      description: 'Show/hide Previous and Next buttons',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
    showNavigationButtons: true,
  },
}

export const ManyPages: Story = {
  args: {
    currentPage: 5,
    totalPages: 50,
    siblingCount: 1,
    showNavigationButtons: true,
  },
}

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
    siblingCount: 1,
    showNavigationButtons: true,
  },
}

export const MoreSiblings: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 2,
    showNavigationButtons: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows more pages around the current page (siblingCount = 2)',
      },
    },
  },
}

export const WithoutNavigationButtons: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    siblingCount: 1,
    showNavigationButtons: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination without Previous/Next buttons',
      },
    },
  },
}

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    siblingCount: 1,
    showNavigationButtons: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with only one page - navigation buttons are disabled',
      },
    },
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 15,
    totalPages: 15,
    siblingCount: 1,
    showNavigationButtons: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows pagination on the last page - Next button is disabled',
      },
    },
  },
}

export const CompactView: Story = {
  args: {
    currentPage: 25,
    totalPages: 100,
    siblingCount: 0,
    showNavigationButtons: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact view with siblingCount = 0, showing only current page',
      },
    },
  },
}
