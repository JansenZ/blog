// 二分法，按照规律寻找
var search = function(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    while(low <= high) {
        let mid = Math.ceil((high + low) / 2);
        let midVal = nums[mid];
        if(midVal == target) {
            return mid;
        }
        // 说明左边是有序数组
        if(midVal > nums[low]) {
            // 说明它就在这里面
            if(target >= nums[low] && target < midVal) {
                // 直接在左边这个有序里找
                high = mid - 1;
            } else {
                // 说明不在这里，去右边找吧只能
                low = mid + 1;
            }
        }
        // 说明右边是有序数组
        else {
            if(target <= nums[high] && target >= midVal) {
                // 说明它就在这里
                low = mid + 1;
            }
            else {
                // 说明不在这里，出去找吧
                high = mid - 1;
            }
        }
        
    }
    return -1;
};