
// 1～n整数中1出现的次数
// 输入一个整数 n ，求1～n这n个整数的十进制表示中1出现的次数。

// 例如，输入12，1～12这些整数中包含1 的数字有1、10、11和12，1一共出现了5次。

// 示例 1：

// 输入：n = 12
// 输出：5
// 示例 2：

// 输入：n = 13
// 输出：6

// 8  = 1 
// 12， 3（11， 12） + 2 = 5
// 22， 11 + 2 = 13
// 32， 11 + 3 = 14
// 99， 11 + 9 = 20；
// 122  = fn(99) + 22 + fn(22) = 20 + 12 + 22 = 56;

// fn(12) = fn(9) + fn(2) + 3
// fn(22) = fn(9) + fn(2) + 11
// fn(122) = fn(99) + fn(22) + 22;
// fn(222) = fn(99) + fn(22) + 100 + fn(99)
// fn(322) = fn(99) + fn(22) + fn(99) + fn(99) + 100

// fn(99) = (fn(9) * 9) + 10;
// fn(19) = fn(9) + 9
// fn(9) = 1;
// fn(10) = fn(9)

// 10/10 = 1;

// if(n < 10) return 1;
// 10 / 10 = 1;
// fn(10) = fn(9) + 1;
// 10 % 10 = 0 + 1;
// fn(12) = fn(9) + fn(9) + 3;
// fn(10) = fn(9) + fn(0) + 1;

// fn(22) = Math.ceil(22 / 10) = 3 + 10 * 1 = 13;
// fn(22) = Math.ceil(22 / 10) + 22 / 10 = 2.2  => 10 1,
// fn(99) = 99/10 = 10 + 10 = 20;
// fn(100) = 10 + 10 + 100%100 + 1 = 21; Math.ceil(100 / 100) = 10 + 100 / 10 = 10 => 10 +  1
// fn(200) = Math.ceil(200 / 10) = 20 + Math.ceil(200 / 100) = 2,

// fn(999) = 100 + 9 * fn(99) + 999 / 100 = 9.9 * fn(9)
// fn(878) = 100 + 8 * fn(99) + Math.ceil(878 / 10) * fn(9);
// fn(99) = 10 + 10 * fn(9);  10 + 9 * fn(9) + (9 / 10 * fn(9)) 
// fn(89) = 10 + 9 * fn(9);
// fn(12) = 2 * fn(9) + 3
// fn(12) = 1 * fn(9) + 
// fn(9) = 1;
// fn(0) = 0;

// fn(101) = fn(99) +

// str.length = 2;
// 百位
// str / 10  = 1.2
// 255

// 8192 = 1000 + 8 * 300 + 192
// 3400 + fn(192)
// fn(19) = 1 + 1 * fn(9) + fn(9);


// 这道题要靠找规律
// 遇到的话直接记住
// 如果它能吃满，它除以对应位数的100，就是大于等于2， 比如222，那值就是100 + 2 * fn(99) + fn(22);
// 吃不满，就是取余数+剩余的那些。
/**
 * @param {number} n
 * @return {number}
 */
var hash = new Map();
var countDigitOne = function(n) {
    n = Number(n);
    if(n == 0) return 0;
    if(n < 10) return 1;
    if(hash.has(n)) return hash.get(n);
    const str = n + '';
    // 几位数
    const len = str.length;
    const sub = '9'.repeat(len - 1);
    const base10 = Math.pow(10, len - 1);
    let count = 0;
    // 说明可以吃满
    if(str / base10 >= 2) {
        // 比如222 = 100 + 2 * fn(99) + fn(22);
        count = base10 + Math.floor(str / base10) * countDigitOne(sub) + countDigitOne(str.slice(1));
    } else {
        // 说明吃不满
        // 比如122 = 23 + 1 * fn(99) + fn(22);
        count = (str % base10) + 1 + countDigitOne(sub) + countDigitOne(str.slice(1))
    }
    hash.set(n, count);
    return count;
};