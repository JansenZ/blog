// 冒泡排序 O(n^2)
// 两两比较，每轮会产生最大的那个。

// 算法记忆点
// 一轮循环递减,因为每轮会找到最大的
// 二轮循环最大值不过i - 1
// 二轮循环每次i 和 i+1 比较，交换位置
var arr = [5, 6, 3, 1, 8, 7, 2, 4];
function sortByBubble(arr) {
    for(var i = arr.length; i > 0; i --) {
        for(var k = 0; k < i - 1; k ++) {
            if(arr[k] > arr[k + 1]) {
                [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]];
            }
        }
    }
}