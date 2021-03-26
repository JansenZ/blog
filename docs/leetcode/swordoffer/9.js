// 把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。例如，数组 [3,4,5,1,2] 为 [1,2,3,4,5] 的一个旋转，该数组的最小值为1。  
// 示例 1：
// 输入：[3,4,5,1,2]
// 输出：1
// 示例 2：
// 输入：[2,2,2,0,1]
// 输出：0
// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

// 思路，找最小的，但是它又是反转过来的，最小的那个，就是反转后的右边第一个就是。
var minArray = function(numbers) {
    let start = 0;
    let end = numbers.length - 1;
    let min = Number.MAX_VALUE;

    while(start <= end) {
        let mid = Math.floor((start + end) / 2);
        if(numbers[mid] < numbers[end]) {
            // 是不是说明右边是个有序数组。
            // 那我应该往左找去。
            end = mid;
        }
        else if(numbers[mid] > numbers[end]) {
            // 说明左边是个有序数组
            // 那我继续在右边找那个最小的
            start = mid + 1;
        }
        else if(numbers[mid] == numbers[end]) {
            // 这个啥也证明不了,两边都有可能。
            end = end - 1;
        }
    }
    return numbers[start];
};

