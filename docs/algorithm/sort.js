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

var arr = [5, 6, 3, 1, 8, 7, 2, 4];
// 选择排序 O(n^2)
// 选择排序就是每轮标记最小的那个值，然后和第一个互换位置。
// 然后以此类推，每次二轮循环都会变低

// 算法记忆
// 选择最小的，也就是找到minidx，然后交还minidx和i的位置。
// 第一轮循环要到arr.length - 1，因为第二轮要从+1开始。
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


var arr = [5, 6, 3, 1, 8, 7, 2, 4];
// 选择排序 O(n^2)
// 选择排序 假定第一个数字是最小的，然后依次和后面的比较，哪个小哪个就记录当前那个的下标。 二循环换了交换minindx 和i 位置。
// 然后以此类推，每次二轮循环都会变低

// 算法记忆
// 选择最小的，也就是找到minidx，然后交还minidx和i的位置。
// 第一轮循环要到arr.length - 1，因为第二轮要从+1开始。
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

var arr = [5, 6, 3, 1, 8, 7, 2, 4];
// 冒泡排序 O(n^2)
// 两两比较，每轮会产生最大的那个。

// 算法记忆点
// 一轮循环递减
// 二轮循环最大值不过i - 1

function sortByBubble(arr) {
    for(var i = arr.length; i > 0; i --) {
        for(var k = 0; k < i - 1; k ++) {
            if(arr[k] > arr[k + 1]) {
                [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]];
            }
        }
    }
}


// 归并排序 O(nlogn)
var arr = [5, 6, 3, 1, 8, 7, 2, 4];
// 归并排序实际上就是拆分数组，从中间拆，直到都只剩下一个为止
// 然后拆分下来的左右最小单位，依次往上比较排序。最后到了顶层就排完了。

// 算法记忆
// 首先，拆分左右数组。其次，最后return的时候，给左右数组包装一个merge函数。
// merge函数里while左右数组的length都大于0的时候，判断左右数组第一个位置谁小，谁小就shift掉给临时数组。
// 最后，当任何一方length为0的时候，说明另外一方还有值在数组里。临时数组最后还要concat左右。拼成完整的链条。

function sortByMerge(arr) {
    if(arr.length == 1) {
        return arr;
    }
    const midIdx = Math.floor(arr.length / 2);
    const leftArr = arr.slice(0, midIdx);
    const rightArr = arr.slice(midIdx);
    return mergeFn(sortByMerge(leftArr), sortByMerge(rightArr));
}
function mergeFn(left, right) {
    let res = [];
    while(left.length && right.length) {
        left[0] < right[0] ? res.push(left.shift()) : res.push(right.shift());
    }
    res = res.concat(left, right);
    return res;
}


var arr = [5, 6, 3, 1, 8, 7, 2, 4];
// 快速排序 O(nlogn)
// 定义一个基准，比它小的放左边，比它大的放右边。好像二分法。
// 算法记忆
// 找到居中的值，splice掉，splice出来的是个数组，要数组[0]的
// 最后concat的时候，中间值不要忘记连接了。

function sortByFast(arr) {
    if(!arr.length) {
        return [];
    }
    if(arr.length == 1) {
        return arr;
    }
    const midIdx = Math.floor(arr.length / 2);
    const midVal = arr.splice(midIdx, 1)[0];
    const leftArr = [];
    const rightArr = [];
    for(var i = 0 ; i < arr.length; i ++ ){
        arr[i] < midVal ? leftArr.push(arr[i]) : rightArr.push(arr[i])
    }
    return sortByFast(leftArr).concat(midVal, sortByFast(rightArr));
}