// KMP算法
// 找到一个子串是否在主串里出现过

// 这个算法需要背下来
// 默认的暴力算法，最坏情况是O m * n
// 但是事实上很少会出现m每次都比较到m-1的情况，所以基本还是会进化到O m + n的水平

// 而利用KMP的话，最坏的情况还是 O m+n的情况，只要你出现重复的，我就能少回退。
// 如果你不重复的，那第一个就匹配不上了。只要能少回退，m就是常数级别。

// 创建一个next组
function buildNext(str) {
    const len = str.length;
    let suffixOffset = 0;
    // 哨兵位
    let prefixOffset = -1;
    let next = [-1];
    // 这里第一个是-1，应对主算法中的小于0 的那个情况
    while (suffixOffset < len - 1) {
        // suffixoffset就是相当于主串，一个一个后移，
        // prefixoffset相当于模式串，找不到就回到上一个next位找。
        if (prefixOffset < 0 || str[suffixOffset] == str[prefixOffset]) {
            prefixOffset++;
            suffixOffset++;
            // 找到了后，给next对应位置赋值即可
            // 这里赋值就是如果相等，就用前一个的next，可以多回退。
            next[suffixOffset] = str[suffixOffset] == str[prefixOffset] ? next[prefixOffset] : prefixOffset;
        } else {
            // 不匹配的话，prefix = 上一个Next位置
            prefixOffset = next[prefixOffset];
        }

    }
    return next;
}

function findIdx(str, mainStr) {
    let move = 0;
    let main = 0;
    let next = buildNext(str);
    // 两个都超过length的情况下，要么找到了，要么没找到，退出while
    while (main < mainStr.length && move < str.length) {
        // 如果move小于0，说明从头开始找
        // 如果两者相等，说明开始匹配到了
        if (move < 0 || mainStr[main] == str[move]) {
            move++;
            main++;
        } else {
            // KMP的核心就是，如果没找到的话，需要回退多少位，利用next组来找
            move = next[move];
        }
    }
    return main - move;
}

// 找子串在主串的位置
function match(str, mainStr) {
    const idx = findIdx(str, mainStr);
    // 如果找到的位置，大于主串长度减子串长度，说明没找到
    if (mainStr.length - str.length < idx) {
        return false;
    }
    return true;
}