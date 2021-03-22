
// 默认属性为0
var newTarget = new Proxy(target, {
    get(obj, prop) {
        return prop in obj ? obj[prop] : 0
    }
})

// 负索引有效
var newTarget = new Proxy(target, {
    get(obj, index) {
        // typeof index 是string
        return +index > 0 ? obj[index] : obj[obj.length + +index]
    }
})

Object.defineProperty(obj, 'll', {
    get() {
        console.log('watttc');  
        return value;
    },

    set(newVal) {
        value = newVal;
    }
})



