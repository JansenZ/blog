// 给定一个二叉树，返回它的中序 遍历。

// 示例:

// 输入: [1,null,2,3]
//    1
//     \
//      2
//     /
//    3

// 输出: [1,3,2]
// 进阶: 递归算法很简单，你可以通过迭代算法完成吗？

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/binary-tree-inorder-traversal
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
// 递归
var inorderTraversal = function(root) {
    var arr = [];
    travel(root, arr);
    return arr;
};
function travel(node, arr) {
    if(!node) return;
    travel(node.left, arr);
    arr.push(node.val);
    travel(node.right, arr);
}

// 迭代，用两个栈分别存右边和自己
var inorderTraversal = function(root) {
    var arr = [];
    var s = [];
    var r = [];
    var x = root;
    while(true) {
        travel(x, s, r);
        if(!s.length) break;
        let d = r.pop();
        arr.push(d.val);
        x = s.pop();
    }
    return arr;
};

function travel(node, s, r) {
    while(node) {
        r.push(node);
        s.push(node.right);
        node = node.left;
    }
}

// https://www.bilibili.com/video/BV1db411L71m?p=173 实在忘记了去看这个，一下就记起来了。
// 迭代， 只用一个栈
var inorderTraversal = function(root) {
    var arr = [];
    var s = [];
    var x = root;
    while(true) {
        // 访问左节点，访问完了就往下
        travel(x, s);
        if(!s.length) break;
        // 取栈尾巴的那个，其实就是最下面的左节点
        x = s.pop();
        // 访问这个没有左节点的节点
        arr.push(x.val);
        // 如果这个节点是个叶节点，不会有右边节点，就会再次回到上面的pop。相当于，左中右。
        x = x.right;
    }
    return arr;
};

function travel(node, s) {
    while(node) {
        s.push(node);
        node = node.left;
    }
}

// 想通过层级遍历来找的，结果写不对
// var isBalanced = function(root) {
//     let crr = [root];
//     let level = 0;
//     let firstFindNullLevel = 0;
//     let flag = false;
//     while(crr.length) {
//         let len = crr.length
//         while(len) {
//             if(level - firstFindNullLevel > 1) return false;
//             let node = crr.shift();
//             if(!flag && !node.left && !node.right) {
//                 // 说明这个点到底了
//                 flag = true;
//             }
//             node.left && crr.push(node.left);
//             node.right && crr.push(node.right);
//             len--;
//         }
//         level++;
//         if(flag) firstFindNullLevel = level;
//     }
//     return true;
// }


// 3, 9, 20
// 15, 7

var isBalanced = function(root) {
   
    var dps = function(node){
        if(!node) return 0
 
        let left = dps(node.left)
        let right = dps(node.right)
 
        if(left == -1 || right == -1){
            return -1
        }
 
        if(Math.abs(left - right) == 0 || Math.abs(left - right) == 1){
            return Math.max(left,right) + 1
        }else{
            return -1
        }
        
    }
 
    return dps(root) >-1
 };
