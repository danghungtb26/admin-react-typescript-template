import type { ColumnDef } from '@tanstack/react-table'
import { renderSimple, screen } from '@/tests/utils/test-utils'
import { DataTable } from '../index'

interface TestRow {
  name: string
  value: number
}

const columns: ColumnDef<TestRow, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'value', header: 'Value' },
]

const mockData: TestRow[] = [
  { name: 'Row 1', value: 100 },
  { name: 'Row 2', value: 200 },
]

describe('DataTable', () => {
  test('renders table with data', () => {
    renderSimple(<DataTable columns={columns} data={mockData} />)
    expect(screen.getByText('Row 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  test('shows no_results when data is empty', () => {
    renderSimple(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('data_table.no_results')).toBeInTheDocument()
  })

  test('shows loading overlay when loading is true', () => {
    renderSimple(<DataTable columns={columns} data={mockData} loading />)
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const loader = document.querySelector('.animate-spin')
    expect(loader).toBeInTheDocument()
  })

  test('renders pagination when showPagination is true', () => {
    renderSimple(<DataTable columns={columns} data={mockData} />)
    expect(screen.getByText('data_table.rows_per_page')).toBeInTheDocument()
  })

  test('hides pagination when showPagination is false', () => {
    renderSimple(
      <DataTable columns={columns} data={mockData} showPagination={false} />
    )
    expect(screen.queryByText('data_table.rows_per_page')).not.toBeInTheDocument()
  })
})
