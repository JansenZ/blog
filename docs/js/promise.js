
var p = new Promise2((resolve, reject)=> {
  setTimeout(()=>{
      resolve('OK');
  }, 1000)
});
p.then();
p.catch();

Promise.resolve();
Promise.reject();
Promise.all();
Promise.race();
// 第一步，先写这里的回调函数 三个状态，then里的函数可以不传。
// 第二步，回调里是可以写异步的，也就是说，到了then里可能还在pending
// 第三步，p是一个链式调用的，所以要包装一个promise2 return出来 并且里面的执行需要try catch，抓错。
// 第四步，防止then里返回promise本身，以及返回的还是一个promise，需要加一个判断函数。如果是本身，reject，如果是promise，继续then，最后resolve。
// 第五步，加catch方法，其实就是调用this.then(null,rejectCallBack);
// 第六步，原型上加一个Resolve和Reject方法，就是调用自己，new Promise()执行对应的方法
// 第七步，all方法，all方法返回的所有promise结果的合集，然后做一个下标，挨个执行promise，然后index++,最后index = promise.length的时候，resolve(result);
// 第八步，race方法，这个直接挨个执行then，resolve即可。这也说明race其他的还是会跑完的。只不过不管结果而已。
class Promise2 {
  constructor(executor) {

      this.state = 'pending';
      this.val = '';
      this.errVal = '';
      this.resolvedCallBacks = [];
      this.rejectedCallBacks = [];

      const resolve = (val) => {
          if(this.state == 'pending') {
              this.state = 'resolved';
              this.val = val;
              this.resolvedCallBacks.forEach(fn=> fn());
          }
      };

      const reject = (err) => {
          if(this.state == 'pending') {
              this.state = 'rejected';
              this.errVal = err;
              this.rejectedCallBacks.forEach(fn=> fn());
          }
      }

      try {
          executor(resolve, reject);
      } catch (error) {
          reject(error);
      }
  }
  
  then(onResolved, onRejected) {
      onResolved = typeof onResolved === 'function' ? onResolved : val => val;
      onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err}
      const state = this.state;
      const promise2 = new Promise2((resolve, reject) => {
          if(state === 'resolved') {
              try {
                  const x = onResolved(this.val);
                  this.isCircle(x,promise2,resolve,reject);
              } catch (error) {
                 reject(error); 
              }
              
          }
          if(state === 'rejected') {
              try {
                  const x = onRejected(this.val);
                  this.isCircle(x,promise2,resolve,reject);
              } catch (error) {
                  reject(error)
              }
              
          }
          if(state === 'pending') {
              this.resolvedCallBacks.push(()=>{
                  try {
                      const x = onResolved(this.val);
                      this.isCircle(x,promise2,resolve,reject);
                  } catch (error) {
                      reject(error)
                  }
                  
              });
              this.rejectedCallBacks.push(()=>{
                  try {
                      const x = onRejected(this.val);
                      this.isCircle(x,promise2,resolve,reject);
                  } catch (error) {
                      reject(error)
                  }
              });
          }
      });
      return promise2;

  }

  isCircle(target, promise2, resolve, reject) {
      if(target === promise2) {
          return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
      }
      if(target instanceof Promise2) {
          target.then(resolve, reject);
      } else {
          resolve(target);
      }
  }

  catch(rejectedCallBack) {
      return this.then(null, rejectedCallBack);
  }
  resolve(val) {
    return new Promise2((r)=>r(val));
  }
  reject(val) {
    return new Promise2((r,j)=>j(val));
  }

  all(promiseAry = []) {
    let index = 0, 
        result = [];
    return new Promise((resolve, reject) => {
      for(let i = 0; i < promiseAry.length; i++){
        promiseAry[i].then(val => {
          index++;
          result[i] = val;
          if( index === promiseAry.length){
            resolve(result)
          }
        }, reject);
      }
    })
  }

  race(promiseArr = []) {
    return new Promise((resolve, reject) => {
      for(let i = 0; i < promiseArr.length; i++){
        promiseArr[i].then(val => {
          resolve(val);
        }, reject);
      }
    })
  }
}


Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};









function nextTick(callback) {
    var mycallback = function() {
        callback();
    }
    var textNode = document.createTextNode('0');
    var observer = new MutationObserver(mycallback)
    observer.observe(textNode,{characterData: true})
    textNode.data = '1';
}



class Promise2 {
    constructor(executor) {
        this.status = 'PENDING';
        this.value;
        this.reason;

        this.onSuccessCallbacks = [];
        this.onFailCallbacks = [];

        let resolve = (value) => {
            if (this.status === 'PENDING') {
                // 只能从 pending -> fulfilled
                this.status = 'SUCCESS';
                this.value = value;
                // 异步时，状态变更了，可以发布要执行的成功态回调了
                this.onSuccessCallbacks.forEach(fn => fn());
            }
        };

        let reject = (reason) => {
            if (this.status === 'PENDING') {
                // 只能从 pending -> rejected
                this.status = 'FAIL';
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

        // 同步时，状态变更，执行成功态回调
        if (this.status === 'SUCCESS') {
            onFulfilled(this.value);
        }
        // 同步时，状态变更，执行失败态回调
        if (this.status === 'FAIL') {
            onRejected(this.value);
        }

        // 异步时，先把回调订阅起来，等到状态变更的时候，再进行发布
        if (this.status === 'PENDING') {
            this.onSuccessCallbacks.push(() => {
                nextTick(() => {
                    onFulfilled(this.value);
                });
            });
            this.onFailCallbacks.push(() => {
                nextTick(() => {
                    onRejected(this.reason);
                })
            });
        }
    }
}

