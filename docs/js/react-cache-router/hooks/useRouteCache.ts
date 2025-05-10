import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useCache } from '../contexts/CacheContext'

export const useRouteCache = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cacheManager } = useCache()

  const push = useCallback(
    (path: string, component: React.ReactNode) => {
      cacheManager.push(path, component)
      navigate(path)
    },
    [navigate, cacheManager]
  )

  const pop = useCallback(() => {
    cacheManager.pop()
    navigate(-1)
  }, [navigate, cacheManager])

  const getCurrentPage = useCallback(() => {
    return cacheManager.getPage(location.pathname)
  }, [location.pathname, cacheManager])

  return {
    push,
    pop,
    getCurrentPage,
    currentPath: location.pathname,
  }
}
