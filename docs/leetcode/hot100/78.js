// 子集
// 有意思的就是核心代码
// 需要看一下

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    let res = [[], [nums[0]]];
    for(var i = 1; i < nums.length; i++) {
        res = res.concat(res.map((k)=> k.concat(nums[i])))
    }
    return res;
};


// [[], [1]] => or + [[2], [1,2]] => or + [3], [1, 3], [2, 3], [1,2,3]