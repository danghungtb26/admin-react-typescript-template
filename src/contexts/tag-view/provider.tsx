import { useNavigate, useRouterState } from '@tanstack/react-router'
import { last, uniqBy } from 'lodash'
import React, { useEffect, useState } from 'react'

import { TagViewModel } from '@/models/tag-view'
import { router_keys } from '@/routers/key'

import { TagViewContext, TagViewContextType } from './context'

type TagViewProviderProps = {}

const TagViewProvider: React.FC<React.PropsWithChildren<TagViewProviderProps>> = ({ children }) => {
  const [tagViews, setTagViews] = useState<TagViewContextType['tagViews']>([TagViewModel.dashboard])

  const addTagView: TagViewContextType['addTagView'] = v => {
    setTagViews(s => uniqBy(s.concat(v), 'path'))
  }

  const navigate = useNavigate()

  const removeTagView: TagViewContextType['removeTagView'] = tagId => {
    const currentPath = state.pathname
    const tag = tagViews.find(i => i.id === tagId)
    if (!tag) return

    if (tag.path === currentPath) {
      const index = tagViews.findIndex(i => i.id === tag.id)
      if (index >= 0) {
        const before = tagViews[index - 1]
        if (before?.path) {
          navigate({ from: before.path })
        }
      }
    }
    setTagViews(s => s.filter(i => i.id !== tag.id))
  }

  const removeOthers: TagViewContextType['removeOthers'] = tagId => {
    const tag = tagViews.find(i => i.id === tagId)
    if (!tag) return

    if (state.pathname !== tag?.path) {
      navigate({
        from: tag?.path ?? router_keys.dashboard,
      })
    }
    setTagViews(s => s.filter(i => !i.deletable || i.id === tag?.id))
  }

  const removeAll: TagViewContextType['removeAll'] = () => {
    const canDelete = tagViews.find(i => !i.deletable)
    if (canDelete?.path) {
      navigate({ from: canDelete.path })
    }
    setTagViews(s => s.filter(i => !i.deletable))
  }

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

  const value: TagViewContextType = {
    tagViews,
    addTagView,
    removeTagView,
    removeAll,
    removeOthers,
  }

  return <TagViewContext.Provider value={value}>{children}</TagViewContext.Provider>
}

export default TagViewProvider
