// 先用二分法寻找目标
// 找到后利用中心扩散寻找前后
var searchRange = function(nums, target) {
    let res = [-1, -1];
    let start = 0, end = nums.length;
    let mid;
    while(start < end) {
        mid = (start + end) >> 1;
        if(nums[mid] < target) start = mid + 1
        if(nums[mid] > target) end = mid
        if(nums[mid] == target) break;
    }
    if(nums[mid] != target) return res;
    let left = mid,right = mid;
    while(nums[left - 1] == target) left --;
    while(nums[right + 1] == target) right ++;
    return [left, right];
};