import { useRouterState } from '@tanstack/react-router'
import { last } from 'lodash'
import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

import { useTagView } from '@/contexts/tag-view/context'
import { TagViewModel } from '@/models/tag-view'

import { TagViewItem } from './tag-view-item'

export const TAG_VIEW_HEIGHT = 34

type TagViewProps = {}

const TagView: React.FC<React.PropsWithChildren<TagViewProps>> = () => {
  const { tagViews, removeTagView, removeAll, removeOthers } = useTagView()

  const state = useRouterState({
    select: s => {
      const match = last(s.matches)
      return {
        pathname: s.location.pathname,
        meta: match?.staticData?.meta ?? {},
        params: match?.params ?? {},
        loaded: s.status === 'idle',
      }
    },
  })

  const onClickRemove: (tag: TagViewModel) => void = tag => {
    removeTagView(tag.id)
  }

  const onClickRemoveOthers: (tag: TagViewModel) => void = tag => {
    removeOthers(tag.id)
  }

  const onClickRemoveAll = () => {
    removeAll()
  }

  return (
    <div className="h-tag-view w-full bg-card border-b border-sidebar-border relative shadow-[0_1px_3px_0_rgba(0,0,0,0.12),0_0_3px_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] [&>div]:overflow-clip! [&>div>div]:whitespace-nowrap">
      <Scrollbars
        autoHide
        autoHideTimeout={500}
        autoHideDuration={200}
        hideTracksWhenNotNeeded={true}
        className="[&_>div]:first:scrollbar-none"
      >
        <div className="flex items-center gap-2 mt-1">
          {tagViews.map(tag => (
            <TagViewItem
              key={tag.id}
              tag={tag}
              isActive={tag.path === state.pathname}
              onRemove={onClickRemove}
              onRemoveOthers={onClickRemoveOthers}
              onRemoveAll={onClickRemoveAll}
            />
          ))}
        </div>
      </Scrollbars>
    </div>
  )
}

export default TagView
