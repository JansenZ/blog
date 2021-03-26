

// 最大子序和

// 输入一个整型数组，数组里有正数也有负数。数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

// 要求时间复杂度为O(n)
// 示例1:

// 输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出: 6
// 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6

// -2

// dp1 = -2

// -2, 1
// 1

// dp2 = dp1, dp1 + 1, 1 = 1

// -2, 1, -3
// 1

// dp3 = dp2 - 3, -3  = 1 - 3 = (-2, -3)

// -2, 1, -3, 4

// dp4 = dp3, 4 = 4

// -2, 1, -3, 4, -1

// dp5 = dp4, -1 = 4

// -2, 1, -3, 4, -1, 2

// dp6 = dp5, 2

// 动态规划，不过这个动态规划转移方程不能是最终解，还要保留一个max。找到最大的那个dp[i]。
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

// 分治算法
// 最大子序和的分治算法，就是分为3个，左，右，和中间。选取最大的。
// 好像邓老师有讲过，需要复习一下。
// https://pic.leetcode-cn.com/3aa2128a7ddcf1123454a6e5364792490c5edff62674f3cfd9c81cb7b5e8e522-file_1576478143567
// 这张图片比较清晰

// 我自己写的一版本，不太好，但是思想到了
var maxSubArray = function (nums) {
    return _maxSubArray(nums);
};

function _maxSubArray(arr) {
    const start = 0;
    const end = arr.length - 1;
    if (start == end) return arr[start];
    let mid = Math.ceil((start + end) / 2);
    return Math.max(_maxSubArray(arr.slice(0, mid)), _maxSubArray(arr.slice(mid)), crossSubArray(arr, mid));
}

function crossSubArray(arr, mid) {
    if (arr.length == 2) return arr[0] + arr[1];
    let leftMax = Number.MIN_SAFE_INTEGER;
    let leftSum = 0;
    for (let i = mid; i >= 0; i--) {
        leftSum += arr[i];
        leftSum > leftMax && (leftMax = leftSum);
    }
    let rightMax = Number.MIN_SAFE_INTEGER;
    let rightSum = 0;
    for (let i = mid + 1; i < arr.length; i++) {
        rightSum += arr[i];
        rightSum > rightMax && (rightMax = rightSum);
    }
    return Math.max(leftMax + rightMax, leftMax, rightMax)
}

// 根据课程，以及别人的的改进的一版，不用slice数组
var maxSubArray = function (nums) {
    return _maxSubArray(nums, 0 , nums.length - 1);
};

function _maxSubArray(arr, start, end) {
    if (start == end) return arr[start];
    let mid = Math.floor((start + end) / 2);
    return Math.max(_maxSubArray(arr, start, mid), _maxSubArray(arr, mid + 1, end), crossSubArray(arr, mid, start, end));
}

function crossSubArray(arr, mid, start, end) {
    if (start == end) return arr[start];
    let leftMax = Number.MIN_SAFE_INTEGER;
    let leftSum = 0;
    for (let i = mid; i >= start; i--) {
        leftSum += arr[i];
        leftSum > leftMax && (leftMax = leftSum);
    }
    let rightMax = Number.MIN_SAFE_INTEGER;
    let rightSum = 0;
    for (let i = mid + 1; i <= end; i++) {
        rightSum += arr[i];
        rightSum > rightMax && (rightMax = rightSum);
    }
    return leftMax + rightMax;
}