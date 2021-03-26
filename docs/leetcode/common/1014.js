
// 给定正整数数组 A，A[i] 表示第 i 个观光景点的评分，并且两个景点 i 和 j 之间的距离为 j - i。

// 一对景点（i < j）组成的观光组合的得分为（A[i] + A[j] + i - j）：景点的评分之和减去它们两者之间的距离。

// 返回一对观光景点能取得的最高分。
// 示例：

// 输入：[8,1,5,2,6]
// 输出：11
// 解释：i = 0, j = 2, A[i] + A[j] + i - j = 8 + 5 + 0 - 2 = 11

// 提示：

// 2 <= A.length <= 50000
// 1 <= A[i] <= 1000




// dp[0] = 0;
// dp[1] = 8;
// dp[2] = 8 + A[2-1] - (i - 0);
// dp[3] = Math.max(dp[2])

// 8+1 -1
// 8+5 -2
// 1+5 -1

// [8,2,1,1,5,7,7]
// 8 + 5 - 4 = 9;
// 其实就是求Math.max(前一个，和选自己，以及前面中最大的那个，偏移一个位置就减1。)
// 8 - 6 = 2；
// 2 - 5 = -3；
// 5 - 2 = 3；
// 7 - 1 = 6；
// for (let i = 0; i < 5; i++) {
    // nums[i] - i;
// }

// 8,5注定能看的出来，5 》 8,所以可以先创建一个maxs数组
// 时间复杂度O(2n),空间复杂度O(2n)
var maxScoreSightseeingPair = function(A) {
    const maxs = getMaxs(A);
    var dp = A[0];
    for (var i = 1; i < A.length; i++) {
        dp[i] = Math.max(dp[i-1], maxs[i - 1] + A[i]);
    }
    return dp[A.length - 1];
};
function getMaxs(nums) {
    let max = [];
    let currentMax = 0;
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] > currentMax) {
            currentMax = nums[i];
        }
        currentMax--;
        max[i] = currentMax;
    }
    return max;
}

// 不要DP了，只和前面一个有关
// 降一下，时间复杂度O（2n）,空间复杂度O（n）
var maxScoreSightseeingPair = function(A) {
    const maxs = getMaxs(A);
    var pre = A[0];
    var current = pre;
    for (var i = 1; i < A.length; i++) {
        current = Math.max(pre, maxs[i - 1] + A[i]);
        pre = current;
    }
    return current;
};
function getMaxs(nums) {
    let max = [];
    let currentMax = 0;
    for (var i = 0; i < nums.length; i++) {
        if (nums[i] > currentMax) {
            currentMax = nums[i];
        }
        currentMax--;
        max[i] = currentMax;
    }
    return max;
}

// 后来发现这个getmaxs的过程也可以在上述循环解决
// 降 时间复杂度O（n），空间复杂度O(1)
var maxScoreSightseeingPair = function(A) {
    let pre = A[0];
    let current = pre;
    let currentMax = A[0] - 1;
    for (var i = 1; i < A.length; i++) {
        current = Math.max(pre, currentMax + A[i]);
        pre = current;
        if (A[i] > currentMax) currentMax = A[i];
        currentMax--;
    }
    return current;
};