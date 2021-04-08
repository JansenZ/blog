// 面试题51. 数组中的逆序对
// 在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。

 

// 示例 1:

// 输入: [7,5,6,4]
// 输出: 5


// O(n^2) 肯定过不了
/**
 * @param {number[]} nums
 * @return {number}
 */
// var reversePairs = function(nums) {
//     let count = 0;
//     for(var i = 0 ; i < nums.length; i ++) {
//         for(var j = i + 1; j < nums.length; j ++) {
//             nums[i] > nums[j] && count ++
//         }
//     }
//     return count;
// };


// 归并排序，这玩意就记下来把，虽然确实是这么回事，但是确实不好想到。
// 通过归并，确实可以正好的，每轮比较，都可以把小于左边的位置代表sum可以加，然后sum 加上左边剩余的length
var reversePairs = function(nums) {
    if(!nums.length) return 0;
    let sum = 0;
    mergesort(nums, 0, nums.length - 1);
    return sum;
    function mergesort(nums, start, end) {
        if(start == end) return [nums[start]];
        let mid = (start + end) >> 1;
        return merge(mergesort(nums, start, mid), mergesort(nums, mid + 1, end));
    }
    function merge(left, right) {;
        let arr = [];
        let i = 0, j = 0;
        while(i < left.length && j < right.length) {
            if(left[i] <= right[j]) {
                arr.push(left[i]);
                i++
            } else {
                // 唯一比归并排序多的一行代码
                // 按照shift那种写法反而好理解
                // 左边的如果大与右边的，因为是从小到大排序
                // 比如左边的5和右边的3比较，进入这循环
                // 所以左边的后续所有的值，都大于右边的这个3
                // 所以左边后续的值的length就是left.length - i;
                sum+= left.length - i;
                arr.push(right[j]);
                j++
            }
        }
        arr = arr.concat(i < left.length ? left.slice(i) : right.slice(j))
        return arr;
    }
};