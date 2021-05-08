
// 对称二叉树
// 递归
// 初始化肯定是左孩子等于右孩子
// 然后就是
// 左边的左边等于右边的右边
// 左边的右边等于右边的左边
// 递归写法
var isSymmetric = function(root) {
    function dfs(left, right) {
        if(left == right) {
            return true;
        }
        if(!left && right || !right && left || left.val !== right.val) {
            return false;
        }
        return dfs(left.left, right.right) && dfs(left.right, right.left);
    }

    return dfs(root.left, root.right);
};