import React, { createContext, ReactNode, useContext } from 'react'

import { PageStatus, RouteCacheManager } from '../utils/RouteCacheManager'

interface CacheContextType {
  cacheManager: RouteCacheManager
}

const CacheContext = createContext<CacheContextType | null>(null)

export const CacheProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cacheManager = RouteCacheManager.getInstance()

  return (
    <CacheContext.Provider value={{ cacheManager }}>
      {children}
    </CacheContext.Provider>
  )
}

export const useCache = () => {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}
