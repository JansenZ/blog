// 给定一个二叉树，返回它的 前序 遍历。

//  示例:

// 输入: [1,null,2,3]  
//    1
//     \
//      2
//     /
//    3 

// 输出: [1,2,3]
// 进阶: 递归算法很简单，你可以通过迭代算法完成吗？

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/binary-tree-preorder-traversal
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
// 递归先序遍历
var preorderTraversal = function(root) {
    var arr = [];
    travel(root, arr);
    return arr;
};
function travel(node, arr) {
    if(!node) return;
    arr.push(node.val);
    travel(node.left, arr);
    travel(node.right, arr);
}

// 迭代先序遍历
var preorderTraversal = function(root) {
    var arr = [];
    var s = [];
    var x = root;
    while(true) {
        travelLeft(x, arr, s);
        if(!s.length) break;
        x = s.pop();
    }
    return arr;
};
function travelLeft(node, arr, s) {
    while(node) {
        arr.push(node.val);
        node.right && s.push(node.right);
        node = node.left;
    }
}

// 迭代先序遍历2
var preorderTraversal = function(root) {
    var arr = [];
    var s = [root];
    var x;
    while(true) {
        x = s.pop();
        if(!x) break;
        arr.push(x.val);
        x.right && s.push(x.right);
        x.left && s.push(x.left);
    }
    return arr;
};