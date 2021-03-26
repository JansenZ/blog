// 106. 从中序与后序遍历序列构造二叉树
// 根据一棵树的中序遍历与后序遍历构造二叉树。

// 注意:
// 你可以假设树中没有重复的元素。

// 例如，给出

// 中序遍历 inorder = [9,3,15,20,7]
// 后序遍历 postorder = [9,15,7,20,3]
// 返回如下的二叉树：

//     3
//    / \
//   9  20
//     /  \
//    15   7



/**
 * Definition for a binary tree node.
 function TreeNode(val) {
     this.val = val;
     this.left = this.right = null;
 }
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */

// 由后序和中序还原树
// 后序的特点就是，后序的最后一个，就是头结点，
// 后序的倒数第二个， 是右结点。所以要先右后左。右没有了才能轮到左

var buildTree = function(inorder, postorder) {
    if(!inorder.length || !postorder.length) return null;
    const tree = new TreeNode(postorder.pop());
    const val = tree.val;
    const idx = inorder.indexOf(val);
    const leftArr = inorder.slice(0, idx);
    const rightArr = inorder.slice(idx + 1);
    tree.right = buildTree(rightArr, postorder);
    tree.left = buildTree(leftArr, postorder);
    return tree;
};