export default class TodoApp {
  constructor(container, { store, eventBus, utils }) {
    this.container = container
    this.store = store
    this.eventBus = eventBus
    this.utils = utils
    this.todos = []
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
            .todo {
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
            .todo-input {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .todo-input input {
                flex: 1;
                padding: 8px;
                border: 1px solid ${
                  this.store.getState('theme') === 'dark' ? '#666' : '#ddd'
                };
                border-radius: 4px;
                background: ${
                  this.store.getState('theme') === 'dark' ? '#444' : '#fff'
                };
                color: ${
                  this.store.getState('theme') === 'dark' ? '#fff' : '#000'
                };
            }
            .todo-input button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background: ${
                  this.store.getState('theme') === 'dark' ? '#666' : '#ddd'
                };
                color: ${
                  this.store.getState('theme') === 'dark' ? '#fff' : '#000'
                };
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .todo-input button:hover {
                background: ${
                  this.store.getState('theme') === 'dark' ? '#888' : '#ccc'
                };
            }
            .todo-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .todo-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: ${
                  this.store.getState('theme') === 'dark' ? '#444' : '#fff'
                };
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            .todo-item.completed {
                opacity: 0.6;
            }
            .todo-item.completed .todo-text {
                text-decoration: line-through;
            }
            .todo-item button {
                padding: 4px 8px;
                border: none;
                border-radius: 4px;
                background: ${
                  this.store.getState('theme') === 'dark' ? '#666' : '#ddd'
                };
                color: ${
                  this.store.getState('theme') === 'dark' ? '#fff' : '#000'
                };
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .todo-item button:hover {
                background: ${
                  this.store.getState('theme') === 'dark' ? '#888' : '#ccc'
                };
            }
            .todo-text {
                flex: 1;
            }
            .todo-empty {
                text-align: center;
                padding: 20px;
                color: ${
                  this.store.getState('theme') === 'dark' ? '#888' : '#666'
                };
            }
        `

    // 创建内容
    const div = document.createElement('div')
    div.className = 'todo'
    div.innerHTML = `
            <h3>待办列表</h3>
            <div class="todo-input">
                <input type="text" id="todoInput" placeholder="输入待办事项">
                <button id="addTodo">添加</button>
            </div>
            <div class="todo-list" id="todoList"></div>
        `

    // 添加事件监听
    const input = div.querySelector('#todoInput')
    const addButton = div.querySelector('#addTodo')

    addButton.addEventListener('click', () => {
      this.addTodo(input.value)
      input.value = ''
    })

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTodo(input.value)
        input.value = ''
      }
    })

    // 添加到容器
    this.container.appendChild(style)
    this.container.appendChild(div)

    // 从本地存储恢复数据
    const savedTodos = this.utils.storage.get('todos')
    if (savedTodos) {
      this.todos = savedTodos
      this.renderTodos()
    }
  }

  addTodo(text) {
    if (!text.trim()) return

    const todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    this.todos.push(todo)
    this.renderTodos()
    this.saveTodos()
    this.eventBus.emit('todoAdded', todo)
  }

  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id)
    this.renderTodos()
    this.saveTodos()
    this.eventBus.emit('todoRemoved', id)
  }

  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
      this.renderTodos()
      this.saveTodos()
      this.eventBus.emit('todoToggled', { id, completed: todo.completed })
    }
  }

  renderTodos(h: CreateElement) {
    const todoList = this.container.querySelector('#todoList')
    if (this.todos.length === 0) {
      todoList.innerHTML = '<div class="todo-empty">暂无待办事项</div>'
      return
    }

    todoList.innerHTML = this.todos
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(
        (todo) => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}
                           onchange="this.getRootNode().host.toggleTodo(${
                             todo.id
                           })">
                    <span class="todo-text">${todo.text}</span>
                    <button onclick="this.getRootNode().host.removeTodo(${
                      todo.id
                    })">删除</button>
                </div>
            `
      )
      .join('')
  }

  saveTodos() {
    this.utils.storage.set('todos', this.todos)
  }

  updateTheme(theme) {
    const todo = this.container.querySelector('.todo')
    todo.style.background = theme === 'dark' ? '#333' : '#f0f0f0'
    todo.style.color = theme === 'dark' ? '#fff' : '#000'

    // 更新输入框样式
    const input = todo.querySelector('input')
    input.style.borderColor = theme === 'dark' ? '#666' : '#ddd'
    input.style.background = theme === 'dark' ? '#444' : '#fff'
    input.style.color = theme === 'dark' ? '#fff' : '#000'

    // 更新按钮样式
    const buttons = todo.querySelectorAll('button')
    buttons.forEach((button) => {
      button.style.background = theme === 'dark' ? '#666' : '#ddd'
      button.style.color = theme === 'dark' ? '#fff' : '#000'
    })

    // 更新待办项样式
    const items = todo.querySelectorAll('.todo-item')
    items.forEach((item) => {
      item.style.background = theme === 'dark' ? '#444' : '#fff'
    })
  }

  updateLanguage(language) {
    const texts = {
      'zh-CN': {
        title: '待办列表',
        placeholder: '输入待办事项',
        add: '添加',
        delete: '删除',
        empty: '暂无待办事项',
      },
      'en-US': {
        title: 'Todo List',
        placeholder: 'Enter todo item',
        add: 'Add',
        delete: 'Delete',
        empty: 'No todo items',
      },
    }

    const text = texts[language] || texts['zh-CN']
    this.container.querySelector('h3').textContent = text.title
    this.container.querySelector('#todoInput').placeholder = text.placeholder
    this.container.querySelector('#addTodo').textContent = text.add
    this.container.querySelectorAll('.todo-item button').forEach((button) => {
      button.textContent = text.delete
    })
    if (this.todos.length === 0) {
      this.container.querySelector('.todo-empty').textContent = text.empty
    }
  }

  unmount() {
    // 清理订阅
    this.unsubscribeTheme()
    this.unsubscribeLanguage()
  }
}
