
let currentObserver;

const proxies = new WeakMap(); // 存放已代理的对象
const observers = new WeakMap(); // 存放代理对象每个key对应的依赖

/**
 * 将对象加工可观察，拦截getter、setter
 * @param {*} obj
 */
function observable(obj) {
  return isObservable(obj) ? proxies.get(obj) : toObservable(obj);
}

/**
 * 判断对象obj是否已经被代理
 * @param {*} obj
 */
function isObservable(obj) {
  return proxies.get(obj);
}

function toObservable(obj) {
  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      // 有了这个全局变量，就代表需要添加依赖收集，和vue的那个dep.target类似。
      if (currentObserver) {
        let map = observers.get(target) || {};
        if (!map[key]) {
          map[key] = new Set([currentObserver]);
        } else {
          map[key].add(currentObserver);
        }
        observers.set(target, map);
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver);
      const map = observers.get(target);
      if (map) {
        // 如果是age的话，obsSet是没有的，因为我没有添加过它。
        const obsSet = map[key];
        obsSet && obsSet.forEach(ob => ob());
      }
      return true;
    }
  });
  proxies.set(obj, proxy); // 将对象存入到proxies中
  return proxy;
}

/**
 * 依赖收集
 * @param {func} cb
 * @type Function
 * @description 通过代理对象的getter方法，将依赖写入到。
 */
function autorun(cb) {
  currentObserver = cb;
  // autorun 本身会跑一次这个cb，这样就会触发内部那些属性的get
  // 从而达到依赖收集的效果
  cb();
  currentObserver = null;
}

const basicLarry = { name: "Larry", age: 25 };
// 第一步
const proxyLarry = observable(basicLarry);

// 第二步：输出autorun:Larry
autorun(() => {
  console.log("autorun:" + proxyLarry.name);
});

// 第三步：输出autorun:3
proxyLarry.name = 3;
proxyLarry.name = 4;

// 第四步：不会输出
proxyLarry.age = 30;
proxyLarry.age = 35;
