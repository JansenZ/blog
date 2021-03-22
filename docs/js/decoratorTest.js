function property(tar, name, desc) {
  console.log("=======property-----", tar, name, desc);
  desc.initializer = function () {
      return '接口好久好久和';
  };
  // desc.writable = false;
  return desc;
}

function setget(tar, name, desc) {
  console.log("======settergetter-----", tar, name, desc);
  return desc;
}

function wrapee(tar, name, desc) {
  console.log('%c====wrapeee==>>>>>>', 'color: #f20', tar, name, desc);
  return desc;
}

function deprecate(extraReason) {
  return function (tar, name, desc) {
      console.log('=====deprecate===', tar, name, desc);
      var oldFn = desc.value;
      desc.value = params => {
          console.warn("==========不要在用这个了" + extraReason);
          oldFn.call(tar, params);
      };
  };
}

function weapon(tar, name, desc) {
  console.log('%c======>>>weapon>>>', 'color: #f20', tar, name, desc);
  return desc;
}



var lifecycle = {};
var sss = Symbol();
function weapon2(tar, name, desc) {
  tar[sss] = function() {
      const target = new tar();
      target.resume && (lifecycle.resume = target.resume.bind(tar))
  }
  return tar;
}




// 直接作用在类上面，比如
// ```
// @weapon
// class AAA {

// }
// ```
// 这样的形式，weapon这个函数里的第一个参数，就是这个类，也就是这个函数
// 而只要在类里面，所有的target，也就是装饰器的第一个参数，都是这个类的原型。
// 可以发现，这些装饰器函数，都在实例化前就全部打印了
// 说明啥，说明是在编译阶段就给弄进去了，所以更不可能指向实例了，因为那时候还没有，所以指向的是原型

// 第二个参数，目前看来都是name，也就是对应的方法名

// 第三个参数，就是`description`。也就是对象的描述。
// ```
// @property
// name = 'jansen';
// @wrapee
// arrowfn= () => {

// }
// ```
// `property`作用在`name`上第三个参数有/`wrapee` 作用在`arrowfn`上第三个参数有
// ```
// configurable: false
// enumerable: true
// 可枚举，如果设置为false,以下3种迭代不会发现这个name
// * for..in循环  ：只遍历对象自身的和继承的可枚举的属性
// * Object.keys方法 ：返回对象自身的所有可枚举的属性的键名
// * JSON.stringify方法：只串行化对象自身的可枚举的属性
// * Object.assign()(ES6）:只拷贝对象自身的可枚举的属性
//  使用这个Object.getOwnPropertyNames，可以破解，详情见对比No.36
// initializer: ƒ () 初始化，return初始化的值。
// writable: true 是否可写，设置为false，原地实现readonly
// ```

// ```
// @setget
// get selfname() {
// }
// ```
// `setget`作用在`get selfname`上，第三个参数有
// ```
// configurable: true
// enumerable: false
// get: ƒ ()
// set: undefined
// ```
// 可以发现，它没有writable，它只有set和get

// ```
// @deprecate("我已经废弃了")
// callBad() {
// }
// ```
// `deprecate`作用在`callbad`方法上，第三个参数有
// ```
// configurable: true
// enumerable: false
// value: ƒ (params)
// writable: true
// ```
// 方法有个value，可以在value里说我废弃啦。

// 有的有value,有的有set get， 其实就是因为一个是数据描述符，一个是存取描述符，它内部帮你排斥好了。
// 这两种是不可以混合使用的，使用会报错。


@weapon
class DecortorFn {
  constructor() {
      this.sex = 'male';
      // 毋庸置疑，这个this就是实例化的this。也就是说它就是ccObj, 因为是ccObj实例
      console.log('%c====constructor this==>>>>>>', 'color: #f20', this);
  }

  resume(h) {
    console.log(h);
  }

  @property
  name = 'jansen';

  @setget
  get selfname() {
      return "fuckkkklklklklklk";
  }

  @wrapee
  arrowfn= () => {
      // 指向cc
      console.log('%c======>ddd this>>>>>', 'color: #f20', this);
  }

  @deprecate("我已经废弃了")
  callBad() {
      // 这里this指向的是原型，因为被method换了
      console.log("this=====", this);
  }

  haha() {
      // 指向cc实例，因为是cc调用的，如果利用call换了个人调用，就是另一个人的。
      console.log('%c=hahathis=====>>>>>>', 'color: #f20', this);
  }
}

console.log('%c=============实例化前====================>>>>>>', 'color: #f20');
export const ccObj = new DecortorFn();
console.log('%c=============实例化后====================>>>>>>', 'color: #f20');
console.log('%c===ccObj===>>>>>>', 'color: #f20', ccObj);
ccObj.callBad();
console.log('%c====DecortorFnPP==>>>>>>', 'color: #f20', DecortorFn);
console.log('%c=====DecortorFnp yuanxing=>>>>>>', 'color: #f20', DecortorFn.prototype);

ccObj.haha();
ccObj.dd();
ccObj.ee();
ccObj.name = 'fuck';
var d = ccObj.selfname;
console.log('%c======>>>>>>', 'color: #f20', ccObj.name);




setTimeout(()=> {
  DecortorFn[sss]();
  console.log(lifecycle);
  lifecycle.resume('hello');
}, 3000)
