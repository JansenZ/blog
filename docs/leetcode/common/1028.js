// 1028. 从先序遍历还原二叉树
// 我们从二叉树的根节点 root 开始进行深度优先搜索。

// 在遍历中的每个节点处，我们输出 D 条短划线（其中 D 是该节点的深度），然后输出该节点的值。（如果节点的深度为 D，则其直接子节点的深度为 D + 1。根节点的深度为 0）。

// 如果节点只有一个子节点，那么保证该子节点为左子节点。

// 给出遍历输出 S，还原树并返回其根节点 root。
// 示例 1：

// 输入："1-2--3--4-5--6--7"
// 输出：[1,2,5,3,4,6,7]
// 示例 2：

// 输入："1-2--3---4-5--6---7"
// 输出：[1,2,5,3,null,6,null,4,null,7]
// 示例 3：
// 输入："1-401--349---90--88"
// 输出：[1,401,null,349,88,90]

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {string} S
 * @return {TreeNode}
 */
// 这提就是耐心一点，不要写错就成
// 不复杂实际上。先建立dep关系，然后按dep分左右组
var recoverFromPreorder = function(S) {
  if (!S) return null;
  var arr = [];
  var dep = 0;
  var number = "";
  S = S + "-";
  for (var i = 0; i < S.length; i++) {
    if (S[i] == "-") {
      if (number) {
        arr.push({
          dep: dep,
          val: number
        });
        dep = 0;
        number = "";
      }
      dep++;
    } else {
      number += S[i];
    }
  }
  let root = new TreeNode(arr.shift().val);
  findChild(root, arr, 1);
  return root;
};

function findChild(node, arr, dep) {
  if (!node || !arr.length) {
    return;
  }
  node.left = new TreeNode(arr.shift().val);
  let idx = arr.findIndex(it => it.dep == dep);
  if (idx != -1) {
    node.right = new TreeNode(arr[idx].val);
  } else {
    node.right = null;
  }

  idx = idx != -1 ? idx : arr.length;

  findChild(node.left, arr.slice(0, idx), dep + 1);
  findChild(node.right, arr.slice(idx + 1), dep + 1);
}
