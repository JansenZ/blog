// 没啥说的，不过看一眼好了
var reverse = function(x) {
    var answer = Number(Math.abs(x).toString().split('').reverse().join(''));
    if(answer > (Math.pow(2,31) - 1)){
        return 0;
    }
    return x>=0 ? answer : -answer
};