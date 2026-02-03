import { findMatchingKeys } from '../utils'

import type { MenuItem } from '../types'

const createMenuItem = (key: string, to: string, children?: MenuItem[]): MenuItem => ({
  key,
  label: key,
  to,
  children,
})

describe('findMatchingKeys', () => {
  test('returns null selectedKey when no match', () => {
    const items: MenuItem[] = [
      createMenuItem('/dashboard', '/dashboard'),
      createMenuItem('/users', '/users'),
    ]
    const result = findMatchingKeys(items, '/other')
    expect(result.selectedKey).toBeNull()
    expect(result.openKeys).toEqual([])
  })

  test('returns matching key for exact path', () => {
    const items: MenuItem[] = [
      createMenuItem('/dashboard', '/dashboard'),
      createMenuItem('/users', '/users'),
    ]
    const result = findMatchingKeys(items, '/users')
    expect(result.selectedKey).toBe('/users')
    expect(result.openKeys).toEqual([])
  })

  test('returns longest matching key when path starts with multiple keys', () => {
    const items: MenuItem[] = [
      createMenuItem('/dashboard', '/dashboard'),
      createMenuItem('/users', '/users'),
      createMenuItem('/users/edit', '/users/edit'),
    ]
    const result = findMatchingKeys(items, '/users/edit')
    expect(result.selectedKey).toBe('/users/edit')
  })

  test('returns child selectedKey and parent in openKeys for nested menu', () => {
    const items: MenuItem[] = [
      createMenuItem('/dashboard', '/dashboard'),
      createMenuItem('/users', '/users', [
        createMenuItem('/users/list', '/users/list'),
        createMenuItem('/users/create', '/users/create'),
      ]),
    ]
    const result = findMatchingKeys(items, '/users/create')
    expect(result.selectedKey).toBe('/users/create')
    expect(result.openKeys).toContain('/users')
  })

  test('handles empty items', () => {
    const result = findMatchingKeys([], '/any')
    expect(result.selectedKey).toBeNull()
    expect(result.openKeys).toEqual([])
  })
})
