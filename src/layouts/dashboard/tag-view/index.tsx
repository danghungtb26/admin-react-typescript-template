import { CloseCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import cx from 'classnames'
import { last } from 'lodash'
import React, { startTransition, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import styled from 'styled-components'

import { useTagView } from '@/contexts/tag-view/context'
import { TagViewModel } from '@/models/tag-view'
import { router_keys } from '@/routers/key'

export const TAG_VIEW_HEIGHT = 34

const Container = styled.div`
  height: ${TAG_VIEW_HEIGHT / 10}rem;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  position: relative;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);

  > div {
    overflow: clip !important;
    > div {
      white-space: nowrap;
    }
  }
`

const TagViewItem = styled(Link)`
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 2.6rem;
  line-height: 2.6rem;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 0.8rem;
  font-size: 1.2rem;
  margin-left: 0.4rem;
  margin-top: 0.4rem;
  &:first-of-type {
    margin-left: 1.5rem;
  }
  &:last-of-type {
    margin-right: 1.5rem;
  }
  &.active {
    background-color: #42b983;
    color: #fff;
    border-color: #42b983;
    &::before {
      content: '';
      background: #fff;
      display: inline-block;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      position: relative;
      margin-right: 2px;
    }
  }
`

const ContextMenu = styled.ul<{ $x: number; $y: number }>`
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 0.5rem 0;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  top: ${p => p.$y / 10}rem;
  left: ${p => p.$x / 10}rem;

  li {
    margin: 0;
    padding: 0.7rem 1.6rem;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
`

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
    <Container ref={container}>
      <Scrollbars
        autoHide
        autoHideTimeout={500}
        autoHideDuration={200}
        hideTracksWhenNotNeeded={true}
      >
        {tagViews.map(tag => (
          <TagViewItem
            onContextMenu={onContextMenu(tag)}
            to={tag.path ?? ''}
            key={tag.id}
            className={cx({ active: tag.path === state.pathname })}
          >
            {tag.title}
            {tag.deletable ? (
              <CloseCircleOutlined
                onClick={onClickRemove(tag)}
                style={{ marginLeft: '1rem' }}
                size={10}
              />
            ) : null}
          </TagViewItem>
        ))}
      </Scrollbars>
      {/* <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {tagViews.map(tag => (
            <TagViewItem key={tag.id}>{tag.title}</TagViewItem>
          ))}
        </div>
      </div> */}
      {currentTag ? (
        <ContextMenu $x={attribute.x} $y={attribute.y} ref={menu}>
          {/* <li onClick={onRefresh}>Refresh</li> */}
          {currentTag.deletable ? <li onClick={onClickRemove(currentTag)}>Close</li> : null}
          <li onClick={onClickRemoveOthers}>Close Others</li>
          <li onClick={onClickRemoveAll}>Close All</li>
        </ContextMenu>
      ) : null}
    </Container>
  )
}

export default TagView
