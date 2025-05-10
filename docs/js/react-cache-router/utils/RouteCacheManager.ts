import { ReactNode } from 'react'

export enum PageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  HIDDEN = 'hidden',
  PAUSED = 'paused',
  RESUMED = 'resumed',
}

interface CachedPage {
  component: ReactNode
  status: PageStatus
  path: string
  onPause?: () => void
  onResume?: () => void
}

export class RouteCacheManager {
  private static instance: RouteCacheManager
  private cache: Map<string, CachedPage>
  private history: string[]
  private readonly maxCacheSize: number

  private constructor() {
    this.cache = new Map()
    this.history = []
    this.maxCacheSize = 10
  }

  public static getInstance(): RouteCacheManager {
    if (!RouteCacheManager.instance) {
      RouteCacheManager.instance = new RouteCacheManager()
    }
    return RouteCacheManager.instance
  }

  public push(
    path: string,
    component: ReactNode,
    callbacks?: { onPause?: () => void; onResume?: () => void }
  ): void {
    // 如果缓存已满，移除最旧的页面
    if (this.cache.size >= this.maxCacheSize) {
      const oldestPath = this.history[0]
      this.cache.delete(oldestPath)
      this.history.shift()
    }

    // 将当前页面设置为暂停状态
    this.cache.forEach((page) => {
      if (page.status === PageStatus.ACTIVE) {
        page.status = PageStatus.PAUSED
        page.onPause?.()
      }
    })

    // 添加新页面
    this.cache.set(path, {
      component,
      status: PageStatus.ACTIVE,
      path,
      onPause: callbacks?.onPause,
      onResume: callbacks?.onResume,
    })
    this.history.push(path)
  }

  public pop(): void {
    if (this.history.length <= 1) return

    // 移除当前页面
    const currentPath = this.history.pop()
    if (currentPath) {
      this.cache.delete(currentPath)
    }

    // 激活上一个页面
    const previousPath = this.history[this.history.length - 1]
    const previousPage = this.cache.get(previousPath)
    if (previousPage) {
      previousPage.status = PageStatus.RESUMED
      previousPage.onResume?.()
      // 短暂延迟后设置为激活状态
      setTimeout(() => {
        if (previousPage) {
          previousPage.status = PageStatus.ACTIVE
        }
      }, 0)
    }
  }

  public getPage(path: string): CachedPage | undefined {
    return this.cache.get(path)
  }

  public getCurrentPath(): string {
    return this.history[this.history.length - 1] || ''
  }

  public clear(): void {
    this.cache.clear()
    this.history = []
  }
}
