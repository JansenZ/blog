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

// 原地快排2
function quickSort(arr, left, right) {
    let pIndx;
    if(left < right) {
        // pIdx其实就是每次寻找到的那个基准点换的位子
        // 所以pIdx没必要参与进来，因为基准点左边都是小于它的
        // 基准点右边都是大于等于它的
        pIndx = partition(arr, left, right);
        quickSort(arr, left, pIndx - 1);
        quickSort(arr, pIndx + 1, right);
    }
    return arr;
}

function partition(arr, left, right) {
    // 基准选0开始
    let pivot = left;
    let index = left + 1;
    for(var i = index; i <= right; i++) {
        // 比基准小的，就和index换，index从基准右边开始。
        // 没换完一个肯定要++了
        if(arr[i] < arr[pivot]) {
            swap(arr, i, index);
            index++;
        }
    }
    // index这个时候已经加上去了，index - 1就是本次轮次最后一个和i换位置的人
    // 基准和index - 1 换，index-1这个位置肯定是小于基准的，所以这样换完后
    // 完成基准左边全部小于基准。
    swap(arr, pivot, index - 1);
    return index - 1;
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}
var nums = [3,5,8,1,2,9,4,7,6]; 
quickSort(nums, 0, nums.length - 1);