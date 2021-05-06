
// 三数之和
// 解法其实有点类似于上面升水的那题
// 利用双指针来进行移动判断。
// 但是有多个边界状况

var threeSum = function(nums) {
    let res = [];
    let length = nums.length;
    nums.sort((a, b) => a - b);
    // 只有这个才有可能
    if(nums[0] <= 0 && nums[length - 1] >= 0) {
        for(let i = 0; i < nums.length - 2; i++) {
            let start = i + 1;
            let end = length - 1;
            while(start < end) {
                let val = nums[i] + nums[start] + nums[end];
                if(val == 0) {
                    res.push([nums[i], nums[start], nums[end]]);
                    // 跳过重复数字
                    while(nums[start] == nums[start + 1]) {
                        start++;
                    }
                    // 跳过重复数字
                    while(nums[end] == nums[end - 1]) {
                        end--;
                    }
                    start++;
                    end--;
                } else if(val < 0) {
                    start++;
                } else {
                    end--;
                }
            }
            // 这个就是边界1，不能重复，所以需要跳过重复的数字
            while (i < length - 2 && nums[i] === nums[i + 1]) {
                i++;
            }
        }
    }
    return res;
};