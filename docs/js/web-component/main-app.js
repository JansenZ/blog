// 公共状态管理
class Store {
  constructor() {
    this.state = {
      user: null,
      theme: 'light',
      language: 'zh-CN',
    }
    this.listeners = new Map()
  }

  // 订阅状态变化
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key).add(callback)
    return () => this.listeners.get(key).delete(callback)
  }

  // 更新状态
  setState(key, value) {
    this.state[key] = value
    this.notify(key)
  }

  // 通知订阅者
  notify(key) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach((callback) => callback(this.state[key]))
    }
  }

  // 获取状态
  getState(key) {
    return this.state[key]
  }
}

// 事件总线
class EventBus {
  constructor() {
    this.events = new Map()
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event).add(callback)
    return () => this.events.get(event).delete(callback)
  }

  // 发布事件
  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach((callback) => callback(data))
    }
  }
}

// 公共工具方法
const utils = {
  // 请求封装
  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      return await response.json()
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  },

  // 本地存储
  storage: {
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
      const value = localStorage.getItem(key)
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    },
    remove(key) {
      localStorage.removeItem(key)
    },
  },

  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
  },
}

// 主应用类
class MicroApp extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    // 初始化公共能力
    this.store = new Store()
    this.eventBus = new EventBus()
    this.utils = utils
  }

  async connectedCallback() {
    const appName = this.getAttribute('name')
    const appUrl = this.getAttribute('url')

    // 创建容器
    const container = document.createElement('div')
    container.className = `micro-app-container ${appName}`
    this.shadowRoot.appendChild(container)

    // 加载前钩子
    this.beforeMount(appName)

    try {
      // 加载子应用
      const module = await import(appUrl)
      const app = new module.default(container, {
        store: this.store,
        eventBus: this.eventBus,
        utils: this.utils,
      })

      // 加载后钩子
      this.afterMount(appName)

      // 挂载子应用
      await app.mount()

      // 保存应用实例
      this.appInstance = app
    } catch (error) {
      console.error(`Failed to load ${appName}:`, error)
      this.handleError(error)
    }
  }

  disconnectedCallback() {
    // 卸载子应用
    if (this.appInstance && typeof this.appInstance.unmount === 'function') {
      this.appInstance.unmount()
    }
  }

  // 加载前钩子
  beforeMount(appName) {
    console.log(`Loading ${appName}...`)
    // 可以在这里添加加载动画等
  }

  // 加载后钩子
  afterMount(appName) {
    console.log(`${appName} loaded successfully`)
    // 可以在这里移除加载动画等
  }

  // 错误处理
  handleError(error) {
    console.error('Application error:', error)
    // 可以在这里添加错误提示等
  }
}

// 注册微应用组件
customElements.define('micro-app', MicroApp)
