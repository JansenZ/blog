// debounce 防抖就是进入函数后，延迟一定时间执行，
// 如果期间再次进这个函数，取消上次执行，再次延迟一段时间执行。
// 支持立即执行和取消。
function debounce(callback, timeout, immediate = false) {
    let timer;
    let flag = 0;
    // 这里是不能用箭头函数的，用了this就会从window上透下来的
    let returnFn = function (...args) {
        timer && clearTimeout(timer);
        if (!flag && immediate) {
            flag++;
            callback.apply(this, args);
        } else {
            timer = setTimeout(() => {
                callback.apply(this, args);
            }, timeout);
        }
    };
    returnFn.cancel = () => {
        timer && clearTimeout(timer);
    };
    return returnFn;
}


var obj = { count: 1, name: 'kk' };
obj.changeCount = function (count) {
    console.log(this.count);
    console.log('cc', count);
    this.count += count;
};
obj.changeCountFn = debounce(obj.changeCount, 1500, true);
