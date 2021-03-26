
// 广度优先遍历，找一个树的同级别。一路找到头
function getSpreadTree(node) {
    let res = [];
    let queue = [node];
    while(queue.length) {
        let dd = queue.shift();
        res.push(dd.val);
        dd.child && queue.push(...dd.child);
    }
    return res;
}