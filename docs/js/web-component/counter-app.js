export default class CounterApp {
  constructor(container, { store, eventBus, utils }) {
    this.container = container
    this.store = store
    this.eventBus = eventBus
    this.utils = utils
    this.count = 0
  }

  async mount() {
    // 订阅主题变化
    this.unsubscribeTheme = this.store.subscribe('theme', (theme) => {
      this.updateTheme(theme)
    })

    // 订阅语言变化
    this.unsubscribeLanguage = this.store.subscribe('language', (language) => {
      this.updateLanguage(language)
    })

    // 创建样式
    const style = document.createElement('style')
    style.textContent = `
            .counter {
                padding: 20px;
                background: ${
                  this.store.getState('theme') === 'dark' ? '#333' : '#f0f0f0'
                };
                border-radius: 8px;
                color: ${
                  this.store.getState('theme') === 'dark' ? '#fff' : '#000'
                };
                transition: all 0.3s ease;
            }
            button {
                padding: 8px 16px;
                margin: 0 8px;
                cursor: pointer;
                border: none;
                border-radius: 4px;
                background: ${
                  this.store.getState('theme') === 'dark' ? '#666' : '#ddd'
                };
                color: ${
                  this.store.getState('theme') === 'dark' ? '#fff' : '#000'
                };
                transition: all 0.3s ease;
            }
            button:hover {
                background: ${
                  this.store.getState('theme') === 'dark' ? '#888' : '#ccc'
                };
            }
            .count-display {
                font-size: 24px;
                margin: 20px 0;
                text-align: center;
            }
            .controls {
                display: flex;
                justify-content: center;
                gap: 10px;
            }
        `

    // 创建内容
    const div = document.createElement('div')
    div.className = 'counter'
    div.innerHTML = `
            <h3>计数器应用</h3>
            <div class="count-display">
                当前计数: <span id="count">0</span>
            </div>
            <div class="controls">
                <button id="increment">+</button>
                <button id="decrement">-</button>
                <button id="save">保存到本地</button>
            </div>
        `

    // 添加事件监听
    div.querySelector('#increment').addEventListener('click', () => {
      this.count++
      this.updateCount()
      this.eventBus.emit('countChanged', this.count)
    })

    div.querySelector('#decrement').addEventListener('click', () => {
      this.count--
      this.updateCount()
      this.eventBus.emit('countChanged', this.count)
    })

    div.querySelector('#save').addEventListener('click', () => {
      this.utils.storage.set('counter', this.count)
      this.eventBus.emit('countSaved', this.count)
      alert('保存成功！')
    })

    // 添加到容器
    this.container.appendChild(style)
    this.container.appendChild(div)

    // 从本地存储恢复数据
    const savedCount = this.utils.storage.get('counter')
    if (savedCount !== null) {
      this.count = savedCount
      this.updateCount()
    }
  }

  updateCount() {
    this.container.querySelector('#count').textContent = this.count
  }

  updateTheme(theme) {
    const counter = this.container.querySelector('.counter')
    counter.style.background = theme === 'dark' ? '#333' : '#f0f0f0'
    counter.style.color = theme === 'dark' ? '#fff' : '#000'

    // 更新按钮样式
    const buttons = counter.querySelectorAll('button')
    buttons.forEach((button) => {
      button.style.background = theme === 'dark' ? '#666' : '#ddd'
      button.style.color = theme === 'dark' ? '#fff' : '#000'
    })
  }

  updateLanguage(language) {
    // 更新界面语言
    const texts = {
      'zh-CN': {
        title: '计数器应用',
        count: '当前计数',
        save: '保存到本地',
      },
      'en-US': {
        title: 'Counter App',
        count: 'Current Count',
        save: 'Save to Local',
      },
    }

    const text = texts[language] || texts['zh-CN']
    this.container.querySelector('h3').textContent = text.title
    this.container.querySelector('#count').previousSibling.textContent =
      text.count + ': '
    this.container.querySelector('#save').textContent = text.save
  }

  unmount() {
    // 清理订阅
    this.unsubscribeTheme()
    this.unsubscribeLanguage()
  }
}
