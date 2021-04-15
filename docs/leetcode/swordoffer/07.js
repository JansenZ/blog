// 输入某二叉树的前序遍历和中序遍历的结果，请重建该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。
// 例如，给出

// 前序遍历 preorder = [3,9,20,15,7]
// 中序遍历 inorder = [9,3,15,20,7]
// 返回如下的二叉树：

//     3
//    / \
//   9  20
//     /  \
//    15   7


// 优化写法，之前写的太乱了
// 特点是先序的第一个，一定就是头结点
// 先序的第二个，不是左节点就是右节点，可以理解为左或者右的整体的递归。
// 用这个点在中序中找到，那么中序的左边的，可以做为新的中序传入递归式。
var buildTree = function(preorder, inorder){
    if(!preorder.length || !inorder.length) return null;
    var tree = new TreeNode(preorder.shift());
    const val = tree.val;
    const idx = inorder.indexOf(val);
    const leftArr = inorder.slice(0, idx);
    const rightArr = inorder.slice(idx + 1);
    tree.left = buildTree(preorder, leftArr);
    tree.right = buildTree(preorder, rightArr)
    return tree;
}