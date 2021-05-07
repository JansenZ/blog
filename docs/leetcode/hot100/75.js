/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
// 双指针
// p0从左往右滑
// p2从右往左滑
var sortColors = function(nums) {
    //  p0用来换0
    let p0 = 0;
    //  p2用来换2
    let p2 = nums.length - 1;

   for(var i = 0; i <= p2; i++) {
       // 如果交换回来的还是2，只能继续换。
       // 而且要先换2，后去看0.不能先看0,因为这样的话,i才不会变，如果先看0的话
       // 2把0换过来了，就没有机会去交换0了
       while(nums[i] == 2 && i <= p2) {
           [nums[i], nums[p2]] = [nums[p2], nums[i]];
           p2--;
       }
       if(nums[i] == 0) {
           [nums[i], nums[p0]] = [nums[p0], nums[i]];
           p0++;
       }
   }
};
