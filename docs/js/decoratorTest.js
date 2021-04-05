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
