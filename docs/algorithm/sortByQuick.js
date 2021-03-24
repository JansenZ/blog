// 快速排序 O(nlogn)
// 定义一个基准，比它小的放左边，比它大的放右边。好像二分法。
// 算法记忆
// 找到居中的值，splice掉，splice出来的是个数组，要取下标[0]获取midval
// 最后concat的时候，中间值不要忘记连接了。

var arr = [5, 6, 3, 1, 8, 7, 2, 4];
function sortByFast(arr) {
    if(!arr.length) {
        return [];
    }
    if(arr.length == 1) {
        return arr;
    }
    const midIdx = arr.length >> 2;
    const midVal = arr.splice(midIdx, 1)[0];
    const leftArr = [];
    const rightArr = [];
    for(var i = 0 ; i < arr.length; i ++ ){
        arr[i] < midVal ? leftArr.push(arr[i]) : rightArr.push(arr[i])
    }
    return sortByFast(leftArr).concat(midVal, sortByFast(rightArr));
}