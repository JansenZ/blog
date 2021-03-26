
// 广度优先遍历
// 广度优先遍历是优先push同层级的节点

// 算法记忆

// 做一个队列数组，默认把第一个node放进去
// while队列数组length大于0的时候，取队列数组的第一个
// res push它的val<，然后判断它有没有子节点，如果有的话，队列数组要push它的解构。
// push它的解构就相当于把它的子节点打平排队到队列后面，这样就实现了广度遍历。

function getBreadTree(node) {
    let res = [];
    let queue = [node];
    while(queue.length) {
        let target = queue.shift();
        res.push(target.val);
        target.child && queue.push(...target.child);
    }
    return res;
}
