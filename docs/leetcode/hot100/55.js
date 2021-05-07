/**
 * @param {number[]} nums
 * @return {boolean}
 */
// 拿到这个题
// 如果当前位子上的值，大于剩余的length，可以直接返回true
// 如果不可以，就要计算当前位子后面的所有值
// 动态规划的感觉呢？
// 又不是动态规划的感觉
// 如果从后往前看，就是前面有没有任何值能到自己这里，能就过，不能就false，理论上on结束？
// var canJump = function(nums) {

//     for(let i = nums.length - 2; i > 0; i++) {
//         let minStep = nums.length - i - 1;
//         // 如果可以，minStep 不变， 求下一个的
//         // 如果不可以，minStep + 1
//         if(nums[i] >= minStep) {

//         }
//     }
// };

// 如果用动态规划呢？
// 到底之后的动态规划，看看最远的距离，如果大与nums.length - 1，那就成功了对吧
var canJump = function(nums) {
    if(nums.length <= 1) return true;
    if(nums[0] == 0) return false;
    let pre = nums[0];
    let cur = -1;
    for(let i = 1; i < nums.length; i ++) {
        cur = Math.max(pre, i + nums[i]);
        if(cur <= i) return false;
        if(cur >= nums.length - 1) return true;
        pre = cur;
    }
    return cur >= nums.length - 1;
};