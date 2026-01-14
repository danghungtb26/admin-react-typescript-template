import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const displayTitle = tag.titleKey ? t(tag.titleKey) : tag.title

  const contextMenuItems: ContextMenuItemType[] = []

  if (tag.deletable) {
    contextMenuItems.push({
      type: 'item',
      label: t('common.actions.close'),
      onClick: () => onRemove(tag),
    })
  }

  contextMenuItems.push({
    type: 'item',
    label: t('common.actions.close_others'),
    onClick: () => onRemoveOthers(tag),
  })

  contextMenuItems.push({
    type: 'item',
    label: t('common.actions.close_all'),
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
          {displayTitle}
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
