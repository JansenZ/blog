// 插入排序 O(n^2)
// 从第一个元素开始，该元素可以认为已经被排序
// 取出下一个元素，在已经排序的元素序列中从后向前扫描
// 如果该元素（已排序）大于新元素，将该元素移到下一位置
// 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置
// 将新元素插入到该位置后
// 重复步骤 2~5

// 算法记忆点
// 一层循环从1开始，比较基准idx = i；
// 二层循环层i - 1开始。判断基准idx 小于 二层i-1。换两个数位置
// 基准idx = k;
var arr = [5, 6, 3, 1, 8, 7, 2, 4];
function sortByInsert(arr) {
    for(var i = 1; i < arr.length; i++) {
        let idx = i;
        for(var k = i -1; k >=0; k--) {
            // 从第二个开始，说明我小于前面的那个人了
            if(arr[idx] < arr[k]) {
                arr[idx] = arr[idx] ^ arr[k];
                arr[k] = arr[idx] ^ arr[k];
                arr[idx] = arr[idx] ^ arr[k];
                idx = k;
            }
            else {
                // 直接跳出本循环
                break;
            }
        }
    }
}