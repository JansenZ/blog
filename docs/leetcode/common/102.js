// 给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。

//  

// 示例：
// 二叉树：[3,9,20,null,null,15,7],

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回其层次遍历结果：

// [
//   [3],
//   [9,20],
//   [15,7]
// ]

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/binary-tree-level-order-traversal
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
 * @return {number[][]}
 */

//  这个解法叫BFS，有个人用DFS和BFS的评论被我收藏了，可以去看。
var levelOrder = function(root) {
    if(!root) return [];

    var arr = [root];
    var r = [];
    while(arr.length) {
        // 本来是不需要这个的，如果它要求的r直接打印一维度数组就行了
        // 但是如果是多维的，就得每次push完，alen就会更新，用完了之后，返回上一级，就说明到了下一个层级了。
        let alen = arr.length;
        let res = [];
        while(alen) {
            var node = arr.shift();
            res.push(node.val);
            node.left && arr.push(node.left);
            node.right && arr.push(node.right);
            alen --;
        }
        r.push(res);
        
    }
    return r;
};