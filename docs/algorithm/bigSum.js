// 大数相加
function bigSum(a, b) {
    // 先转字符串
    var arr1 = a.toString().split('');
    var arr2 = b.toString().split('');
    var res = '';
    // 进位存起来
    var flag = 0;
    
    // 3个都有位子
    while (arr1.length || arr2.length || flag) {
        // 每个尾相加
        // ~~ 相当于Number(), 转数字类型
        flag += ~~arr1.pop() + ~~arr2.pop();
        // 余数存起来
        res = flag % 10 + res;
        // 进位肯定是1，当true用也行， 写1都可以
        flag = flag > 9;
    }
    return res;
}