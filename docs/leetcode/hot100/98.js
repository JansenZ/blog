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
 * @return {boolean}
 */
// 这个方式思路就出现了问题，因为并不能只看3个值。比如
    //     5
    // 4       6
    //     3       7

    // 这个3是不对的，3比6小，但是3不比5大
    var isValidBST = function(root) {
        if(!root) return true;
    
        function isvalid(node, pval, isLeft) {
            if(!node) return true;
            let pre = isLeft ? node.val < pval : node.val > pval;
            if(pre) {
                return isvalid(node.left, node.val, true) && isvalid(node.right, node.val);
            }
            return false;
        }
    
        return isvalid(root.left, root.val, true) && isvalid(root.right, root.val);
    };
    // 改用中序遍历
    // 只有是升序，才是对的。
    var isValidBST = function(root) {
        let res = [];
        let stack = [];
        let node = root;
        while(true) {
            while(node) {
                stack.push(node);
                node = node.left;
            }
    
            if(!stack.length) break;
    
            let x = stack.pop();
            if(x.val <= res[res.length - 1]) return false;
            res.push(x.val);
    
            node = x.right;
        }
        return true;
    };