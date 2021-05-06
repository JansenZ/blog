// 题干的意思是：找出这个数组排序出的所有数中，刚好比当前数大的那个数
// 比如当前 nums = [1,2,3]。这个数是123，找出1，2，3这3个数字排序可能的所有数，排序后，比123大的那个数 也就是132
// 如果当前 nums = [3,2,1]。这就是1，2，3所有排序中最大的那个数，那么就返回1，2，3排序后所有数中最小的那个，也就是1，2，3 -> [1,2,3]



// 解决方案就是，从后往前找，如果一直没有发生交换，说明是个降序，直接反转即可
// 如果前面的小于后面的那个值后
// 开始找到后面的最小的，仅大于前面的这个值
// 然后把两个人交换
// 交换完后，后面的一定是个降序数组，反转即可。

// 这题坑的地方就是各种小边界，恶心人。

var nextPermutation = function(nums) {
    if(nums.length < 2) return nums;
    let isSwap = false;
    for(var i = nums.length - 2; i >= 0; i--) {
        // 根据大量试错发现
        // 交换了之后，后面的百分百是降序，所以直接reverse即可。
        // 说明前面的小于后面的了，需要进行寻找
        if(nums[i] < nums[i + 1]) {
            isSwap = true;
            let minx = i + 1;
            let flag = i + 1;
            // 找到仅大于当前的那个最小的值
            while(flag <= nums.length - 1) {
                if(nums[flag] > nums[i]) {
                    minx = nums[minx] >= nums[flag] ? flag : minx;
                }
                flag ++;
            }
            let tmp = nums[i];
            nums[i] = nums[minx];
            nums[minx] = tmp;
            // 原地变换
            swap(nums, i + 1, nums.length - 1);
            return;
        }
    }
    // 说明是降序，直接反转
    if(!isSwap) {
        // 如果不是原地，直接nums.reverse();
        swap(nums, 0, nums.length - 1);
    }
};

function swap(nums, start, end) {
    while(start <= end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start ++;
        end --;
    }
}



// 优化方案
// 可以发现，这个for的作用就是找到那个左右不对劲的，所以可以改成while。
// 其次，在寻找大于当前i的最小值的时候，从后往前找，找到就可以停了其实。因为是降序排列
var nextPermutation = function(nums) {
    if(nums.length < 2) return nums;
    let i = nums.length - 2;
    while(i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    if(i >=0 ) {
        // 发现不对劲了，找到对应的i了
        // 从后往前找
        let k = nums.length - 1;
        while(k > i) {
            if(nums[k] > nums[i]) {
                // 交换K和i
                [nums[i], nums[k]] = [nums[k], nums[i]];
                break;
            }
            k--;
        }
    }
    // 反转后面的
    swap(nums, i + 1, nums.length - 1);
};

function swap(nums, start, end) {
    while(start <= end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start ++;
        end --;
    }
}
