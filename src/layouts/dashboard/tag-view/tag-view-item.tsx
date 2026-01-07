import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { X } from 'lucide-react'
import React from 'react'

import { ContextMenu, ContextMenuItemType } from '@/components/molecules/context-menu'
import { TagViewModel } from '@/models/tag-view'

interface TagViewItemProps {
  tag: TagViewModel
  isActive: boolean
  onRemove: (tag: TagViewModel) => void
  onRemoveOthers: (tag: TagViewModel) => void
  onRemoveAll: () => void
}

export const TagViewItem: React.FC<TagViewItemProps> = ({
  tag,
  isActive,
  onRemove,
  onRemoveOthers,
  onRemoveAll,
}) => {
  const contextMenuItems: ContextMenuItemType[] = []

  if (tag.deletable) {
    contextMenuItems.push({
      type: 'item',
      label: 'Close',
      onClick: () => onRemove(tag),
    })
  }

  contextMenuItems.push({
    type: 'item',
    label: 'Close Others',
    onClick: () => onRemoveOthers(tag),
  })

  contextMenuItems.push({
    type: 'item',
    label: 'Close All',
    onClick: onRemoveAll,
  })

  return (
    <ContextMenu items={contextMenuItems}>
      <Link to={tag.path ?? ''} className="first:ml-3.75 last:mr-3.75">
        <div
          className={cx(
            'inline-flex items-center gap-1 relative cursor-pointer h-tag px-2 text-xs',
            {
              'bg-tag-view text-white before:w-2 before:h-2 before:rounded-full before:bg-white before:mr-1':
                isActive,
              'bg-tag-inactive-bg text-tag-inactive-text hover:bg-tag-inactive-hover border':
                !isActive,
            },
          )}
        >
          {tag.title}
          {tag.deletable ? (
            <X
              onClick={e => {
                e.preventDefault()
                onRemove(tag)
              }}
              className="ml-1 p-px size-3 hover:bg-gray-400 hover:rounded-full transition-colors cursor-pointer"
            />
          ) : null}
        </div>
      </Link>
    </ContextMenu>
  )
}
