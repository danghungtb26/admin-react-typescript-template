import React from 'react'
import { renderSimple, screen } from '@/tests/utils/test-utils'
import DashboardContainer from '../index'
import { vi } from 'vitest'

vi.mock('react-countup', () => ({
  default: ({ end }: { end: number }) => React.createElement('span', null, end),
}))

vi.mock('echarts', () => ({
  init: () => ({
    setOption: vi.fn(),
    dispose: vi.fn(),
    resize: vi.fn(),
  }),
  graphic: {
    LinearGradient: function LinearGradient() {
      return {}
    },
  },
}))

describe('DashboardContainer', () => {
  test('renders reports overview header', () => {
    renderSimple(<DashboardContainer />)
    expect(screen.getByText('dashboard.reports_overview')).toBeInTheDocument()
  })

  test('renders create report button', () => {
    renderSimple(<DashboardContainer />)
    expect(screen.getByRole('button', { name: 'dashboard.create_report' })).toBeInTheDocument()
  })

  test('renders select data dropdown', () => {
    renderSimple(<DashboardContainer />)
    expect(screen.getByRole('button', { name: /dashboard.select_data/ })).toBeInTheDocument()
  })
})
