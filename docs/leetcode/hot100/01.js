// 没啥可说的
// easy
var twoSum = function(nums, target) {
    let map = new Map();
    for(let idx in nums){
        let t2 = target - nums[idx];
        if(map.has(t2)) {
            return [map.get(t2), idx];
        }
        map.set(nums[idx], idx);
    }
    return false;
};