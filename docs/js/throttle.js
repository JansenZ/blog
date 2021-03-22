/**
 * 节流函数
 * @param {Function} fn
 * @param {Number} wait 阈值
 * @param {Object} options 选项
 * @param {Boolean} options.leading 首次是否执行 默认为 true
 * @param {Boolean} options.trailing 结束后是否再执行一次 默认为 true
 */
// throttle 节流，每隔一段时间执行一次，比如scroll的时候，本来的帧数比较高，你又不需要的情况下，可以每500ms执行一次。
// 支持立即执行和结束时立即执行，结束必须要立即执行，不然滚动停止后实际上可能还停留在之前的位置的计算。
function throttle(callback, timeout, options) {
    options = options || {
        leading: true,
        trailing: true
    };
    let timer;
    let startTime = 0;
    // 这里是不能用箭头函数的，用了this就会从window上透下来的
    let backFn = function (...args) {
        let now = +new Date();

        !startTime && !options.leading && (startTime = now);
        timer && clearTimeout(timer);
        // startTime = now;
        // 差值大于timeout执行。
        if (now - startTime > timeout) {
            callback.apply(this, args);
            startTime = now;
        } else {
            if (options.trailing) {
                timer = setTimeout(() => {
                    callback.apply(this, args);
                }, timeout - now + startTime);
            };
        }
    };
    return backFn;
}
var obj = { count: 1, name: 'kk' };
obj.changeCount = function (count) {
    console.log(this);
    console.log('cc', count);
    this.count += count;
};
obj.changeCountFn = throttle(obj.changeCount, 1500);
