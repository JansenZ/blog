// 经典打家劫舍
// dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
var rob = function(nums) {
    if(nums.length < 2) return nums[0]
    let target = Math.max(nums[0], nums[1]);
    let dp = [nums[0], target];
    for(var i = 2; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    return dp[nums.length - 1];
};