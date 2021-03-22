
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
