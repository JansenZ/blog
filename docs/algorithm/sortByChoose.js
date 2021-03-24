// 选择排序 O(n^2)
// 选择排序就是每轮标记最小的那个值，然后和第一个互换位置。
// 然后以此类推，每次二轮循环都会变低

// 算法记忆
// 选择最小的，也就是找到minidx，然后交还minidx和i的位置。
// 第一轮循环要到arr.length - 1，因为第二轮要从+1开始。
var arr = [5, 6, 3, 1, 8, 7, 2, 4];
function sortByChoose(arr) {
    for(var i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for(k = i + 1; k < arr.length; k++) {
            if(arr[k] < arr[minIdx]) {
                minIdx = k;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
}
