// hard
// hard的原因是需要用O(log(m+n))来完成，如果只是 O(m+n)，就是easy
// easy的情况下，直接while跑数组，取到第K小的数字即可。偶数就是两个相加即可。


// hard1
// 采用二分法，比如两个数组总长度是11，那么中位数就是第6个数。
// 两个数组都取 Math.floor(6/2) - 1  = 2 下标的数。
// 这个下标我用K代指
// 比较A[k]和B[k]大小，如果A[k]小于等于B[k]，说明A数组k下标之前的数字，都是小于B[k]，所以把这部分全部剔除。
// 剔除后，还剩下4个数。
// 然后继续比较 4/2 -1 = 1下标的数。
// 注意，这里剔除的那个数组相当于splice吧。所以对于的下标是新的1，不是老1。
// 直到剔除了正好那第几个数，然后就可以比较了。
// https://leetcode-cn.com/problems/median-of-two-sorted-arrays/solution/xun-zhao-liang-ge-you-xu-shu-zu-de-zhong-wei-s-114/
// 官方题解讲的还行。


// hard2
// 核心就是 AL < BR && BL < AR。
// 满足就找到了
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    let len1 = nums1.length;
    let len2 = nums2.length;
    // 确保左边的是最小的数组，方便while
    if(len1 > len2) return findMedianSortedArrays(nums2, nums1);
    // 获得整体size
    let allSize = len1 + len2;
    let start = 0;
    let end = len1;
    // 不能出界
    while(start <= end) {
        let cut1 = (start + end) >> 1;
        let cut2 = ((allSize + 1) >> 1) - cut1;

        let AL = cut1 == 0 ? -Infinity : nums1[cut1 - 1];
        let AR = cut1 == len1 ? Infinity : nums1[cut1];
        let BL = cut2 == 0 ? -Infinity : nums2[cut2 - 1];
        let BR = cut2 == len2 ? Infinity : nums2[cut2];
        // 核心，就是左右大小的问题
        // 就是左1要小于右2，左2要大于右1
        // AL <= BR && BL <= AR
        if(AL > BR) {
            // 左1如果大与右2了很好理解，就是左边最小的都大与右边最大的，肯定说明不在里面，左边要左移
            end = cut1 - 1;
        } else if(AR < BL) {
            //主要是这个，左边的数组2小于右边的数组1，说明左边的最大的小于右边的最小的，肯定也不行。
            start = cut1 + 1;
        } else {
            // 必须是左边的最小的，小于右边的最大的，左边的最大的大于右边的最小的。
            return allSize & 1 ? Math.max(AL,BL) : (Math.max(AL,BL) + Math.min(AR, BR)) / 2
        }
    }
};
