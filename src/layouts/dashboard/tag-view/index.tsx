import { CloseCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import cx from 'classnames'
import { last } from 'lodash'
import React, { startTransition, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

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

  const [attribute, setAttribute] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [currentTag, setCurrentTag] = useState<TagViewModel>()

  const menu = useRef<HTMLUListElement>(null)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside: React.EventHandler<any> = event => {
      if (menu.current && !menu.current.contains(event.target)) {
        startTransition(() => {
          setCurrentTag(undefined)
        })
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menu])

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

  const onClickRemove: (tag: TagViewModel) => React.MouseEventHandler<HTMLSpanElement> =
    tag => e => {
      e.preventDefault()
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
      startTransition(() => {
        setCurrentTag(undefined)
      })
    }

  const onContextMenu: (tag: TagViewModel) => React.MouseEventHandler<HTMLAnchorElement> =
    tag => e => {
      e.preventDefault()
      const containerRect = container.current?.getBoundingClientRect() ?? { x: 0, y: 0 }
      const offsetLeft = e.currentTarget.getBoundingClientRect().x // container margin left

      const elementLeft = offsetLeft - containerRect.x + e.nativeEvent.offsetX // 15: margin right

      const elementTop = e.nativeEvent.offsetY
      startTransition(() => {
        setAttribute({ x: elementLeft, y: elementTop + 10 })
        setCurrentTag(tag)
      })
    }

  const onClickRemoveOthers = () => {
    if (location.pathname !== currentTag?.path) {
      navigate({
        from: currentTag?.path ?? router_keys.dashboard,
      })
    }
    removeOthers(currentTag?.id)
    startTransition(() => {
      setCurrentTag(undefined)
    })
  }

  const onClickRemoveAll = () => {
    const canDelete = tagViews.find(i => !i.deletable)
    navigate({ from: canDelete?.path ?? router_keys.dashboard })
    removeAll()
    startTransition(() => {
      setCurrentTag(undefined)
    })
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
          <Link
            key={tag.id}
            to={tag.path ?? ''}
            onContextMenu={onContextMenu(tag)}
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
                onClick={onClickRemove(tag)}
                style={{ marginLeft: '1rem' }}
                size={10}
              />
            ) : null}
          </Link>
        ))}
      </Scrollbars>
      {currentTag ? (
        <ul
          ref={menu}
          className="m-0 bg-white z-3000 absolute list-none py-2 px-0 rounded-md text-xs font-normal text-[#333] shadow-[2px_2px_3px_0_rgba(0,0,0,0.3)]"
          style={{ top: `${attribute.y / 10}rem`, left: `${attribute.x / 10}rem` }}
        >
          {currentTag.deletable ? (
            <li
              onClick={onClickRemove(currentTag)}
              className="m-0 py-1.75 px-4 cursor-pointer hover:bg-context-menu-hover"
            >
              Close
            </li>
          ) : null}
          <li
            onClick={onClickRemoveOthers}
            className="m-0 py-1.75 px-4 cursor-pointer hover:bg-context-menu-hover"
          >
            Close Others
          </li>
          <li
            onClick={onClickRemoveAll}
            className="m-0 py-1.75 px-4 cursor-pointer hover:bg-context-menu-hover"
          >
            Close All
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export default TagView
