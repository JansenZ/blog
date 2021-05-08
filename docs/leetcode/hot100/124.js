/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */

// const maxPathSum = (root) => {
//     let maxSum = Number.MIN_SAFE_INTEGER; // 最大路径和

//     const dfs = (root) => {
//         if (root == null) { // 遍历到null节点，收益0
//            return 0;
//         }
//         const left = dfs(root.left);  // 左子树提供的最大路径和
//         const right = dfs(root.right); // 右子树提供的最大路径和

//         const innerMaxSum = left + root.val + right; // 当前子树内部的最大路径和
//         maxSum = Math.max(maxSum, innerMaxSum);      // 挑战最大纪录

//         const outputMaxSum = root.val + Math.max(left, right); // 当前子树对外提供的最大和

//         // 对外提供的路径和为负，直接返回0。否则正常返回
//         return outputMaxSum < 0 ? 0 : outputMaxSum;
//     };

//     dfs(root);  // 递归的入口
//     return maxSum; 
// };
// https://leetcode-cn.com/problems/binary-tree-maximum-path-sum/solution/shou-hui-tu-jie-hen-you-ya-de-yi-dao-dfsti-by-hyj8/
// 参考如上
var maxPathSum = function(root) {
    let res = Number.MIN_SAFE_INTEGER;
    function dfs(node) {
         // 没有节点，返回0
        if(!node) return 0
        let left = dfs(node.left);
        let right = dfs(node.right);
        let innerMax = node.val + left + right;
        //    挑战最大值
        res = Math.max(innerMax, res);
        //    对于父节点的最大收益值
        let outMax = node.val + Math.max(left, right);
        //  如果是负的，没必要加起来其实。
        //  如果某个子树 dfs 结果为负，走入它，收益不增反减，该子树应被忽略，杜绝选择走入它的可能，让它返回 0，像null一样如同砍掉。
        return outMax > 0 ? outMax : 0;
        
    } 
    dfs(root);
    return res;
 };