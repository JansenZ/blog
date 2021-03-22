    // 中序遍历
    // 递归写法
    var arr = [];
    function traverseMid(node) {
        if (!node) return;
        // 先左节点
        traverseMid(node.left);
        // 中值
        arr.push(node.val);
        // 再右
        traverseMid(node.right);
    }

    // 迭代写法
    function traverseMid(root) {
        let arr = [];
        let r = [];
        let node = root;
        while (true) {
            // 先一路访问到最左边的节点
            // 一路上的点存起来
            while (node) {
                r.push(node);
                node = node.left;
            }
            // 没有了就推出
            if (!r.length) break;
            // 取出末尾的节点打印，然后转到它的右节点去。
            let x = r.pop();
            // 这样所谓的左节点，也是父节点。
            arr.push(x.val);
            node = x.right;
        }
        return arr;
    }