import '../styles/routeAnimation.css'

import React, { useEffect, useState } from 'react'

import CachedRoute from '../components/CachedRoute'
import { useRouteCache } from '../hooks/useRouteCache'
import { PageStatus } from '../utils/RouteCacheManager'

const Page1: React.FC = () => {
  const [status, setStatus] = useState<PageStatus>(PageStatus.ACTIVE)
  const { push } = useRouteCache()

  const handlePause = () => {
    console.log('页面1暂停')
    setStatus(PageStatus.PAUSED)
  }

  const handleResume = () => {
    console.log('页面1恢复')
    setStatus(PageStatus.RESUMED)
  }

  useEffect(() => {
    console.log('页面1状态:', status)
  }, [status])

  return (
    <div className="page-content">
      <h1>页面 1</h1>
      <p>当前状态: {status}</p>
      <button
        onClick={() =>
          push('/page2', <Page2 />, {
            onPause: handlePause,
            onResume: handleResume,
          })
        }
      >
        前往页面 2
      </button>
    </div>
  )
}

const Page2: React.FC = () => {
  const [status, setStatus] = useState<PageStatus>(PageStatus.ACTIVE)
  const { pop } = useRouteCache()

  const handlePause = () => {
    console.log('页面2暂停')
    setStatus(PageStatus.PAUSED)
  }

  const handleResume = () => {
    console.log('页面2恢复')
    setStatus(PageStatus.RESUMED)
  }

  useEffect(() => {
    console.log('页面2状态:', status)
  }, [status])

  return (
    <div className="page-content">
      <h1>页面 2</h1>
      <p>当前状态: {status}</p>
      <button onClick={() => pop()}>返回页面 1</button>
    </div>
  )
}

const Example: React.FC = () => {
  return (
    <div className="route-container">
      <CachedRoute path="/page1" component={<Page1 />} />
      <CachedRoute path="/page2" component={<Page2 />} />
    </div>
  )
}

export default Example
