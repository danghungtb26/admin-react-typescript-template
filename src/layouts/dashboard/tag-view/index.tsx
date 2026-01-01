import { CloseCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import cx from 'classnames'
import { last } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

import { ContextMenu, ContextMenuItemType } from '@/components/molecules/context-menu'
import { useTagView } from '@/contexts/tag-view/context'
import { TagViewModel } from '@/models/tag-view'
import { router_keys } from '@/routers/key'

export const TAG_VIEW_HEIGHT = 34

type TagViewProps = {}

const TagView: React.FC<React.PropsWithChildren<TagViewProps>> = () => {
  const { tagViews, addTagView, removeTagView, removeAll, removeOthers } = useTagView()

  const navigate = useNavigate()

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

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.loaded)
      addTagView(
        TagViewModel.fromJson({
          title: state.meta.title ?? state.pathname,
          title_key: state.meta.titleKey,
          path: state.pathname,
          params: state.params,
        }),
      )
  }, [state])

  const onClickRemove: (tag: TagViewModel) => () => void = tag => () => {
    if (tag.path === state.pathname) {
      const index = tagViews.findIndex(i => i.id === tag.id)
      if (index < 0) {
        return
      }

      const before = tagViews[index - 1]
      navigate({
        from: before.path ?? '',
      })
    }
    removeTagView(tag.id)
  }

  const onClickRemoveOthers: (tag: TagViewModel) => () => void = tag => () => {
    if (location.pathname !== tag?.path) {
      navigate({
        from: tag?.path ?? router_keys.dashboard,
      })
    }
    removeOthers(tag?.id)
  }

  const onClickRemoveAll = () => {
    const canDelete = tagViews.find(i => !i.deletable)
    navigate({ from: canDelete?.path ?? router_keys.dashboard })
    removeAll()
  }

  const getContextMenuItems = (tag: TagViewModel): ContextMenuItemType[] => {
    const items: ContextMenuItemType[] = []

    if (tag.deletable) {
      items.push({
        type: 'item',
        label: 'Close',
        onClick: onClickRemove(tag),
      })
    }

    items.push({
      type: 'item',
      label: 'Close Others',
      onClick: onClickRemoveOthers(tag),
    })

    items.push({
      type: 'item',
      label: 'Close All',
      onClick: onClickRemoveAll,
    })

    return items
  }

  return (
    <div
      ref={container}
      className="h-tag-view w-full bg-white border-b border-tag-border relative shadow-[0_1px_3px_0_rgba(0,0,0,0.12),0_0_3px_0_rgba(0,0,0,0.04)] [&>div]:overflow-clip! [&>div>div]:whitespace-nowrap"
    >
      <Scrollbars
        autoHide
        autoHideTimeout={500}
        autoHideDuration={200}
        hideTracksWhenNotNeeded={true}
      >
        {tagViews.map((tag, index) => (
          <ContextMenu key={tag.id} items={getContextMenuItems(tag)}>
            <Link
              to={tag.path ?? ''}
              className={cx(
                'inline-block relative cursor-pointer h-tag leading-tag border border-tag-border text-tag-text bg-white px-2 text-xs ml-1 mt-1',
                {
                  'bg-tag-active text-white border-tag-active before:content-[""] before:bg-white before:inline-block before:w-2 before:h-2 before:rounded-full before:relative before:mr-0.5':
                    tag.path === state.pathname,
                  'ml-3.75': index === 0,
                  'mr-3.75': index === tagViews.length - 1,
                },
              )}
            >
              {tag.title}
              {tag.deletable ? (
                <CloseCircleOutlined
                  onClick={e => {
                    e.preventDefault()
                    onClickRemove(tag)()
                  }}
                  style={{ marginLeft: '1rem' }}
                  size={10}
                />
              ) : null}
            </Link>
          </ContextMenu>
        ))}
      </Scrollbars>
    </div>
  )
}

export default TagView
