// 参考这个，清晰明了
// https://segmentfault.com/a/1190000020536257
const SUCCESS = 'fulfilled';
const FAIL = 'rejected';
const PENDING = 'pending';

// 判断x是否为一个promsie
function resolvePromise(promise2, x, resolve, reject) {
    // 死循环了，需要提示
    if (promise2 === x) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    // 严谨度：一个promsie一生只能改变一次状态
    let called;
    // 如果x是一个函数，或者一个对象，那么我就可以认为它有可能是一个promsie
    if (typeof x === 'function' || (typeof x === 'object' && x != null)) {
        // 捕获同步错误
        try {
            // 获取到x上的then，判断它是否是一个函数
            let then = x.then;
            if (typeof then === 'function') {
                // 如果是，那么，他就是一个promsie，去执行他。
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    // 递归，这里面的y 有可能也会返回一个promsie，那么就要再次走一遍校验
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                // 不是一个promsie
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        // 肯定不是了
        resolve(x);
    }
}

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value;
        this.reason;

        this.onSuccessCallbacks = [];
        this.onFailCallbacks = [];

        let resolve = (value) => {
            if (this.status === PENDING) {
                // 只能从 pending -> fulfilled
                this.status = SUCCESS;
                this.value = value;
                // 异步时，状态变更了，可以发布要执行的成功态回调了
                this.onSuccessCallbacks.forEach(fn => fn());
            }
        };

        let reject = (reason) => {
            if (this.status === PENDING) {
                // 只能从 pending -> rejected
                this.status = FAIL;
                this.reason = reason;
                // 异步时，状态变更了，可以发布要执行的失败态回调了
                this.onFailCallbacks.forEach(fn => fn());
            }
        };

        try {
            // 同步执行，需要捕获错误
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        // 处理 值穿透
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

        let promise2;

        promise2 = new Promise((resolve, reject) => {
            // 同步时，状态变更，执行成功态回调
            if (this.status === SUCCESS) {
                // 此处用定时器，是因为里面需要拿到已经构建完成的promsie2
                setTimeout(() => {
                    // 捕获同步错误
                    try {
                        // 成功态的回调的返回值，需要判断它是否是又是一个promsie？
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            // 同步时，状态变更，执行失败态回调
            if (this.status === FAIL) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }

            // 异步时，先把回调订阅起来，等到状态变更的时候，再进行发布
            if (this.status === PENDING) {
                this.onSuccessCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onFailCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });
        // 一个promsie一生只改变一次状态。promsie的链式调用，那么，then里面会返回一个新的promsie
        return promise2;
    }
}

// 用于测试的 先安装 npm i promises-aplus-tests -g
// promises-aplus-tests 文件名
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = Promise;