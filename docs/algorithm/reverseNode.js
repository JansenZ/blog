var obj5 = {val: 5, next: null};
var obj4 = {val: 4, next: obj5};
var obj3 = {val: 3, next: obj4};
var obj2 = {val: 2, next: obj3};
var obj1 = {val: 1, next: obj2};

function NodeList(val) {
    this.val = val;
    this.next = null;
};

// 直接两两反转
let reverse = (node) => {
    let newHead = null;
    while(node) {
        // 临时取到next
        let next = node.next;
        // 指向改变
        node.next = newHead;
        // 统统往后移一位。
        newHead = node;
        node = next;
    }
    // 返回newHead
    return newHead;
}

// 采用头插法
let reverse = (node) => {
    let newHead = new NodeList();
    let pre = null;
    while(node) {
        let next = node.next;
        node.next = pre;
        newHead.next = node;

        pre = node;
        node = next;
    }
    // 返回newHead
    return newHead.next;
}


// 区间翻转
function reverseNode(node, m ,n) {
    let reverse = (pre, cur) => {
        if(!cur) return pre;
        // 保存 next 节点
        let next = cur.next;
        cur.next = pre;
        return reverse(cur, next);
    }

    let start = node;
    let cur = node;
    let front,tail;

    for(let i=1; i<m-1; i++) {
        cur = cur.next;
    }
    front = cur;
    start = front.next;
    for(let i = m; i < n; i++) {
        cur = cur.next;
    }
    tail = cur.next;

    front.next = reverse(null, start);
    start.next = tail;
    return node;
}