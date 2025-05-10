import '../styles/routeAnimation.css'

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useRouteCache } from '../hooks/useRouteCache'
import { PageStatus } from '../utils/RouteCacheManager'

interface CachedRouteProps {
  path: string
  component: React.ReactNode
  onPause?: () => void
  onResume?: () => void
}

const CachedRoute: React.FC<CachedRouteProps> = ({
  path,
  component,
  onPause,
  onResume,
}) => {
  const { getCurrentPage } = useRouteCache()
  const location = useLocation()
  const page = getCurrentPage()
  const [animationClass, setAnimationClass] = useState<string>('')

  useEffect(() => {
    if (!page) return

    switch (page.status) {
      case PageStatus.ACTIVE:
        setAnimationClass('enter-active')
        break
      case PageStatus.PAUSED:
        setAnimationClass('paused')
        onPause?.()
        break
      case PageStatus.RESUMED:
        setAnimationClass('resumed')
        onResume?.()
        break
      case PageStatus.HIDDEN:
        setAnimationClass('exit-active')
        break
      default:
        setAnimationClass('')
    }
  }, [page?.status, onPause, onResume])

  const getPageStyle = () => {
    if (!page) return { display: 'none' }
    return { display: 'block' }
  }

  return (
    <div className={`route-page ${animationClass}`} style={getPageStyle()}>
      {component}
    </div>
  )
}

export default CachedRoute
