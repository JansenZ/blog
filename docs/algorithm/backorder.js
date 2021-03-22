// 后序遍历
// 递归写法
var arr = [];
function traverseLast(node) {
    if (!node) return;
    // 先左节点
    traverseLast(node.left);
    // 再右
    traverseLast(node.right);
    // 后值
    arr.push(node.val);
}
// 非递归
// 后序的思路不一样
function traverseLast(root) {
    let arr = [];
    let r = [root];
    while (r.length) {
        let x = r.pop();
        while (x) {
            arr.push(x.val);
            x.left && r.push(x.left);
            x = x.right;
        }
    }
    return arr.reverse();
}
