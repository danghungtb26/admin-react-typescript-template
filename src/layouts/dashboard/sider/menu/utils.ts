import type { MenuItem } from './types'

export const findMatchingKeys = (
  items: MenuItem[],
  currentPath: string,
): { selectedKey: string | null; openKeys: string[] } => {
  let bestMatch: { key: string; length: number } | null = null
  const openKeys: string[] = []

  for (const item of items) {
    if (currentPath.startsWith(item.key)) {
      if (!bestMatch || item.key.length > bestMatch.length) {
        bestMatch = { key: item.key, length: item.key.length }
      }
    }

    if (item.children) {
      const childResult = findMatchingKeys(item.children, currentPath)
      if (childResult.selectedKey) {
        openKeys.push(item.key, ...childResult.openKeys)
        const childKeyLength = childResult.selectedKey.length
        if (!bestMatch || childKeyLength > bestMatch.length) {
          bestMatch = { key: childResult.selectedKey, length: childKeyLength }
        }
      }
    }
  }

  return {
    selectedKey: bestMatch?.key || null,
    openKeys,
  }
}
