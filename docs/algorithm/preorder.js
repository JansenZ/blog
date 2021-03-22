// 先序遍历
// 递归写法
var arr = [];
function traversePre(node) {
    if (!node) return;
    // 先值
    arr.push(node.val);
    // 后访问左节点
    traversePre(node.left);
    // 再右
    traversePre(node.right);
}
// 非递归
// 通用版本，可以适配中序和后序
function traversePre(root) {
    let arr = [];
    let r = root ? [root] : [];
    while (r.length) {
        let node = r.pop();
        while (node) {
            arr.push(node.val);
            // 有右节点，把它推到队列尾部
            node.right && r.push(node.right);
            // 继续往下找左
            node = node.left;
        }
    }
    return arr;
}
// 非递归优化版
// 只用一个while，把左右都推进去。后进先出
// 只适配先序遍历
var preorderTraversal = function(root) {
    var arr = [];
    var s = root ? [root] : [];
    while (s.length) {
        let x = s.pop();
        arr.push(x.val);
        // 先push右
        x.right && s.push(x.right);
        // 再push左，然后pop
        x.left && s.push(x.left);
    }
    return arr;
};
