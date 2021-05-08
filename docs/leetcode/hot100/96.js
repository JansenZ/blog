
// 这题其实还挺考究的
// 虽然也是用动态规划
// 但是很容易看不懂
// 需要记下来
// 配合 这个 https://leetcode-cn.com/problems/unique-binary-search-trees/solution/shou-hua-tu-jie-san-chong-xie-fa-dp-di-gui-ji-yi-h/

// 如果整数 1 - n 中的 k 作为根节点值，则 1 - k-1 会去构建左子树，k+1 - n 会去构建右子树。
// 左子树出来的形态有 aa 种，右子树出来的形态有 bb 种，则整个树的形态有 a * ba∗b 种。
// 以 kk 为根节点的 BSTBST 种类数 = 左子树 BSTBST 种类数 * 右子树 BSTBST 种类数

/**
 * @param {number} n
 * @return {number}
 */
const numTrees = (n) => {
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    for (let i = 2; i <= n; i++) {
      for (let j = 0; j <= i - 1; j++) {
          dp[i] += dp[j] * dp[i - j - 1];
      }
    }
    return dp[n];
  };