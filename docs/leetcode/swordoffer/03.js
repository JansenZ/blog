// 在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。
// 示例 1：
// 输入：
// [2, 3, 1, 0, 2, 5, 3]
// 输出：2 或 3 
// 限制：
// 2 <= n <= 100000

/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function(nums) {
    var obj = {};
    let len = nums.length;
    for(let i = 0; i < len; i++) {
        let t = nums[i];
        if(obj[t]) {
            return t;
        }
        obj[t] = 1;
    }
};

var findRepeatNumber = function(nums) {
    let ws = new Set();
    for(let v of nums) {
        if(ws.has(v)) return v;
        ws.add(v);
    }
    return false;
};

// 没有任何难度，没有题解