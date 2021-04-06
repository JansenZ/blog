// 算是动态规划的一种变种吧
// 一个动态方程不够用，需要一个max
// 找到最大的那个dp[i]。
var maxSubArray = function (nums) {
    if (!nums.length) return null;
    let dp = [nums[0]];
    let max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i] , nums[i]);
        if (max < dp[i]) max = dp[i];
    }
    return max;
}