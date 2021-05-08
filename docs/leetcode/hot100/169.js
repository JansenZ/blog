// 多数元素
// 就是摩尔投票
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    let win = nums[0];
    let flag = 1;
    for(var i = 1; i < nums.length; i++) {
        if(flag == 0) {
            win = nums[i];
            flag = 1;
        } else {
            nums[i] == win ? flag++ : flag --;
        }
    }
    return win;
};