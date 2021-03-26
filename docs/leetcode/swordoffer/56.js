// 一个整型数组 nums 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

//  

// 示例 1：

// 输入：nums = [4,1,4,6]
// 输出：[1,6] 或 [6,1]
// 示例 2：

// 输入：nums = [1,2,10,4,1,4,3,3]
// 输出：[2,10] 或 [10,2]
//  

// 限制：

// 2 <= nums.length <= 10000

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。


// 首先，遇到类似这种其他都是两次，只有一个数字或者两个数字只出现一次的，肯定都是用异或^位运算
// 其次，这里的核心的核心是
// 最后异或出来的，肯定是那两个不同的数字异或的结果，现在目的就是要找到他们
// 异或是 相同变0，不同的变1
// 既然两个数字是不同的，那么两个数字在二进制位上，一定有一个位是1
// 找到最右边的1，然后用这个单1去整体里遍历&。这样就一定会把两个数分开，因为一个是1，一个是0
// 而其他的两个一样的数据，其实不用关心，因为一样，所以不管怎么分，一定是分到同一半区。

// 需要注意的是 a & b == 0 会执行成 a & (b == 0)所以前面要带括号

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var singleNumbers = function(nums) {
    let axb = 0;
    for(var k of nums) {
        axb ^= k;
    }
    console.log('%c======>>>>>>', 'color: #f20', axb);
    // 拿到了a^b的值
    // 现在开始找那个1
    let split = 1;
    while((split & axb) == 0) {
        split <<= 1;
    }
    console.log('%c======>>>>>>', 'color: #f20', split);
    let a = 0,b = 0;
    // 现在找到了这个单1的split了
    for(var p of nums) {
        if(p & split) {
            a ^= p
        } else {
            b ^= p
        }
    }
    return [a,b];
};