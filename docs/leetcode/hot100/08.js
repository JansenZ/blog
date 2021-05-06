// 
var myAtoi = function(str) {
    str = str.trim();
    let res = parseInt(str);
    if(isNaN(res)){return 0}
    let top = Math.pow(2,31) -1;
    let min = -Math.pow(2,31);
    if(res > 0 && res > top){return top}
    if(res < 0 && res < min){return min}
    return res
};