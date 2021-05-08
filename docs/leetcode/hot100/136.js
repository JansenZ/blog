// 异或，没啥好说的
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    if(nums.length < 2) return nums[0]
    return nums.reduce((a, b)=> a ^ b);
};