// 输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 true，否则返回 false。假设输入的数组的任意两个数字都互不相同。

// 参考以下这颗二叉搜索树：

//      5
//     / \
//    2   6
//   / \
//  1   3
// 示例 1：

// 输入: [1,6,3,2,5]
// 输出: false
// 示例 2：

// 输入: [1,3,2,6,5]
// 输出: true

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

var verifyPostorder = function(postorder) {
    if(postorder.length < 2) return true;
    const last = postorder.pop();
    const splitIdx = postorder.findIndex((k)=> k > last);
    let leftArr = postorder;
    let rightArr = [];
    if(splitIdx != -1) {
        leftArr = postorder.slice(0, splitIdx);
        rightArr = postorder.slice(splitIdx);
    }
    return rightArr.every((k) => k > last) && verifyPostorder(leftArr) && verifyPostorder(rightArr);
};