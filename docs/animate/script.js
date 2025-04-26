class LinkedList {
    constructor() {
        this.head = null;
        this.length = 0;
    }

    // 创建新节点
    createNode(value) {
        return {
            value,
            next: null
        };
    }

    // 初始化链表
    init(length) {
        this.head = null;
        this.length = 0;
        for (let i = 0; i < length; i++) {
            this.insert(i, i);
        }
    }

    // 在指定位置插入节点
    insert(position, value) {
        if (position < 0 || position > this.length) {
            return false;
        }

        const newNode = this.createNode(value);

        if (position === 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            let previous = null;
            let index = 0;

            while (index++ < position) {
                previous = current;
                current = current.next;
            }

            newNode.next = current;
            previous.next = newNode;
        }

        this.length++;
        return true;
    }

    // 删除指定位置的节点
    delete(position) {
        if (position < 0 || position >= this.length) {
            return null;
        }

        let current = this.head;

        if (position === 0) {
            this.head = current.next;
        } else {
            let previous = null;
            let index = 0;

            while (index++ < position) {
                previous = current;
                current = current.next;
            }

            previous.next = current.next;
        }

        this.length--;
        return current.value;
    }

    // 获取指定位置的节点
    get(position) {
        if (position < 0 || position >= this.length) {
            return null;
        }

        let current = this.head;
        let index = 0;

        while (index++ < position) {
            current = current.next;
        }

        return current;
    }
}

class LinkedListAnimation {
    constructor() {
        this.list = new LinkedList();
        this.animationSpeed = 500; // 默认动画速度 500ms
        this.bindEvents();
        this.updateSpeedDisplay();
    }

    bindEvents() {
        const initBtn = document.getElementById('initBtn');
        const operateBtn = document.getElementById('operateBtn');
        const speedControl = document.getElementById('speedControl');

        initBtn.addEventListener('click', () => this.initList());
        operateBtn.addEventListener('click', () => this.operateList());
        speedControl.addEventListener('input', () => this.updateSpeed());
    }

    updateSpeed() {
        this.animationSpeed = document.getElementById('speedControl').value;
        this.updateSpeedDisplay();
    }

    updateSpeedDisplay() {
        document.getElementById(
            'speedValue'
        ).textContent = `${this.animationSpeed}ms`;
    }

    async initList() {
        const length = parseInt(document.getElementById('listLength').value);
        if (isNaN(length) || length < 0) {
            alert('请输入有效的链表长度');
            return;
        }

        this.list.init(length);
        await this.renderList();
    }

    async operateList() {
        const operation = document.getElementById('operation').value;
        const position = parseInt(document.getElementById('position').value);
        const value = parseInt(document.getElementById('value').value);

        if (isNaN(position) || position < 0) {
            alert('请输入有效的位置');
            return;
        }

        if (operation === 'insert' && isNaN(value)) {
            alert('请输入有效的插入值');
            return;
        }

        if (operation === 'insert') {
            await this.insertNode(position, value);
        } else {
            await this.deleteNode(position);
        }
    }

    async insertNode(position, value) {
        if (position < 0 || position > this.list.length) {
            alert('插入位置无效');
            return;
        }

        // 创建新节点
        const newNode = this.list.createNode(value);

        // 如果是头部插入
        if (position === 0) {
            await this.insertAtHead(newNode);
        } else {
            await this.insertAtPosition(position, newNode);
        }

        this.list.length++;
    }

    async insertAtHead(newNode) {
        // 高亮显示新节点
        const newNodeElement = this.createNodeElement(newNode);
        newNodeElement.classList.add('new');
        document.getElementById('linkedList').appendChild(newNodeElement);

        await this.delay();

        // 断开原头节点连接
        if (this.list.head) {
            const headElement = document.querySelector('.node');
            headElement
                .querySelector('.node-pointer')
                .classList.add('disconnected');
            await this.delay();
        }

        // 连接新节点
        newNode.next = this.list.head;
        this.list.head = newNode;

        const pointer = newNodeElement.querySelector('.node-pointer');
        pointer.classList.add('connecting');
        await this.delay();

        this.renderList();
    }

    async insertAtPosition(position, newNode) {
        let current = this.list.head;
        let previous = null;
        let index = 0;

        // 找到插入位置
        while (index < position) {
            previous = current;
            current = current.next;
            index++;
        }

        // 高亮显示前驱节点
        const previousElement = document.querySelectorAll('.node')[index - 1];
        previousElement.classList.add('previous');
        await this.delay();

        // 创建并显示新节点
        const newNodeElement = this.createNodeElement(newNode);
        newNodeElement.classList.add('new');
        document.getElementById('linkedList').appendChild(newNodeElement);
        await this.delay();

        // 断开原连接
        if (current) {
            const currentElement = document.querySelectorAll('.node')[index];
            currentElement
                .querySelector('.node-pointer')
                .classList.add('disconnected');
            await this.delay();
        }

        // 建立新连接
        newNode.next = current;
        previous.next = newNode;

        const pointer = newNodeElement.querySelector('.node-pointer');
        pointer.classList.add('connecting');
        await this.delay();

        this.renderList();
    }

    async deleteNode(position) {
        if (position < 0 || position >= this.list.length) {
            alert('删除位置无效');
            return;
        }

        let current = this.list.head;

        if (position === 0) {
            await this.deleteAtHead();
        } else {
            await this.deleteAtPosition(position);
        }

        this.list.length--;
    }

    async deleteAtHead() {
        // 高亮显示要删除的节点
        const headElement = document.querySelector('.node');
        headElement.classList.add('current');
        await this.delay();

        // 断开连接
        headElement
            .querySelector('.node-pointer')
            .classList.add('disconnected');
        await this.delay();

        // 删除节点
        this.list.head = this.list.head.next;
        this.renderList();
    }

    async deleteAtPosition(position) {
        let current = this.list.head;
        let previous = null;
        let index = 0;

        // 找到要删除的节点
        while (index < position) {
            previous = current;
            current = current.next;
            index++;
        }

        // 高亮显示前驱节点和当前节点
        const previousElement = document.querySelectorAll('.node')[index - 1];
        const currentElement = document.querySelectorAll('.node')[index];

        previousElement.classList.add('previous');
        currentElement.classList.add('current');
        await this.delay();

        // 断开连接
        currentElement
            .querySelector('.node-pointer')
            .classList.add('disconnected');
        await this.delay();

        // 建立新连接
        previous.next = current.next;

        const pointer = previousElement.querySelector('.node-pointer');
        pointer.classList.add('connecting');
        await this.delay();

        this.renderList();
    }

    createNodeElement(node) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';

        const valueElement = document.createElement('div');
        valueElement.className = 'node-value';
        valueElement.textContent = node.value;

        const pointerElement = document.createElement('div');
        pointerElement.className = 'node-pointer';

        nodeElement.appendChild(valueElement);
        nodeElement.appendChild(pointerElement);

        return nodeElement;
    }

    async renderList() {
        const container = document.getElementById('linkedList');
        container.innerHTML = '';

        let current = this.list.head;
        while (current) {
            const nodeElement = this.createNodeElement(current);
            container.appendChild(nodeElement);
            current = current.next;
        }
    }

    delay() {
        return new Promise((resolve) =>
            setTimeout(resolve, this.animationSpeed)
        );
    }
}

// 初始化动画
const animation = new LinkedListAnimation();
