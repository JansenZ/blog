function new2(fn, ...args) {
    var target = {};
    target.__proto__ = fn.prototype;
    const ret = fn.call(target, ...args);
    return typeof ret === 'object' ? ret : target;
}

// 这里需要注意的是，如果原函数返回值是对象类型，这个new是没有意义的，得到的就是原函数的返回值， 只有原函数返回是值类型，才是正常的

function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return {
        name: name,
        habit: 'Games'
    }
}

var person = new Otaku('Kevin', '18');

// person 只有name，和habit


function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return [1,2,3];
}

var person = new Otaku('Kevin', '18');

// person 就是【1，2，3】