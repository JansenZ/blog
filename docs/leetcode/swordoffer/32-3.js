// 请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

//  

// 例如:
// 给定二叉树: [3,9,20,null,null,15,7],

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回其层次遍历结果：

// [
//   [3],
//   [20,9],
//   [15,7]
// ]


// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



// 锯齿二叉层级树


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
// 层级旋转的时候最好最后再反转。
// 如果想在内城while操作的话，在push left right根据left判断会出错。
var levelOrder = function(root) {
    if(!root) return [];
    let queue = [root];
    let arr = [];
    let isleft = true;
    while(queue.length) {
        let qlen = queue.length;
        let crr = [];
        while(qlen) {
            let node = queue.shift();
            crr.push(node.val);
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
            qlen--
        }
        arr.push(isleft ? crr : crr.reverse()); 
        isleft = !isleft
    }
    return arr;
};