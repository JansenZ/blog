// 输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

//  

// 示例 1:

// 输入: [10,2]
// 输出: "102"
// 示例 2:

// 输入: [3,30,2,5,9]
// 输出: "3033459"
//  

// 提示:

// 0 < nums.length <= 100
// 说明:

// 输出结果可能非常大，所以你需要返回一个字符串而不是整数
// 拼接起来的数字可能会有前导 0，最后结果不需要去掉前导 0

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。


// dp(1) = 10
// dp(2) = Math.max(dp(1) + '' + nums[i], nums[i] + '' + dp(1));

// dp1 = 3
// dp2 = 330, 303
// dp3 = 3032 2303
// dp4 = 303345, 530334


// [0,9,8,7,6,5,4,3,2,1]

var minNumber = function(nums) {
    // 这样是不对的，0987654321 得不到 0123456789的
    // var dp = [nums[0] + ''];
    // for(var i = 1; i < nums.length; i ++) {
    //     dp[i] = dp[i - 1] + '' + nums[i] > nums[i] + '' + dp[i - 1] ? nums[i] + '' + dp[i - 1] : dp[i - 1] + '' + nums[i]
    // }
    // return dp[nums.length - 1]

    // 干脆就直接字符串排序，然后串起来返回
    // 但是直接改成字符串然后比较的话，也是不对的
    // 因为'3' < '30'，但是303比330小。
    return quicksort(nums).join('');

    // 第一个和每一次匹配，看是否有资格在前？如果有，第一个确定在前？
    // 然后看第二个谁有资格在前？
    // 那是否快排的比较大小也可以改成这个样子呢？
    // 好的，那就改造一下
};
function quicksort(arr) {
    let len = arr.length;
    if(!arr.length) return [];
    if(len == 1) return arr;
    let mid = Math.floor(len / 2);
    let cval = arr.splice(mid, 1)[0] + '';
    let leftArr = [], rightArr = [];
    for(var i = 0; i < arr.length; i ++) {
        // 这里改造一下，利用a+''+b 来比较即可。
        if((arr[i] + '' + cval) < (cval + '' + arr[i])) {
            leftArr.push(arr[i])
        } else {
            rightArr.push(arr[i]);
        }
    }
    return quicksort(leftArr).concat(cval, quicksort(rightArr));
}

// 利用自带的库函数改一下就是
// sort函数，前面的减后面的就是从小到大，后面的减前面的就是从大到小。记忆就是前-后=小到大。后就是高，高就是大。 前减后就是小到高小到大
var minNumber = function(nums) {
    return nums.sort((a, b) => (a + '' + b) - (b + '' + a)).join('');
}