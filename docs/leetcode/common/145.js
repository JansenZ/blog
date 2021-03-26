// 给定一个二叉树，返回它的 后序 遍历。

// 示例:

// 输入: [1,null,2,3]  
//    1
//     \
//      2
//     /
//    3 

// 输出: [3,2,1]
// 进阶: 递归算法很简单，你可以通过迭代算法完成吗？

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/binary-tree-postorder-traversal
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
// 递归后序遍历
var postorderTraversal = function(root) {
    var arr = [];
    travel(root, arr);
    return arr;
};
function travel(node, arr) {
    if(!node) return;
    travel(node.left, arr);
    travel(node.right, arr);
    arr.push(node.val);
}


// 迭代后序遍历
// 把先序的根左右，变成根右左。
// 然后再反转数组即可。
// 这样最后多出来的就是反转数组数字本身的一个时间复杂度，依然要比递归快不少。
var postorderTraversal = function(root) {
    var arr = [];
    var s = [];
    var x = root;
    while(true) {
        travelRight(x, arr, s);
        if(!s.length) break;
        x = s.pop();
    }
    return arr.reverse();
};
function travelRight(node, arr, s) {
    while(node) {
        arr.push(node.val);
        node.left && s.push(node.left);
        node = node.right;
    }
}