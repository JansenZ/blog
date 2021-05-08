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
 * @return {void} Do not return anything, modify root in-place instead.
 */

// 最简单的想法，肯定是先先序遍历
// 然后挨个往right添加

// 但是好像要直接用原来的节点
// 所以要判断有没有左，如果有的话，（左边）的右才等于右
// 括号递归， 右边其实也要递归，防止出现 
        // 1
        //    2
        // 3
        var flatten = function(root) {
            if(!root) return null;
            let node = root;
            let next = flatten(node.right);
            let left = flatten(node.left);
            
            if(left) {
                // 找到左节点的最右边那个节点
                node.right = left;
                while(left.right) {
                    left = left.right
                }
                left.right = next;
            }
            // 置空左子树
            node.left = null;
            
            return node;
        };
        