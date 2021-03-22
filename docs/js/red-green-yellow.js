// 等红灯3秒
// 绿灯两秒
// 黄灯1秒

function red() {
    console.log('red');
}

function green() {
    console.log('green');
}

function yellow() {
    console.log('yellow');
}

function light(fn, timeout) {
    return new Promise((r) => {
        setTimeout(() => {
           fn();
           r('ok');
        }, timeout);
    });
}

var step = function() {
    Promise.resolve().then(() => {
        return light(green, 3000);
    }).then(()=> {
        return light(yellow, 2000)
    }).then(()=> {
        return light(red, 1000)
    }).then(()=>{
        step();
    })
}
red();
step();


// 先亮红灯
// 3秒后绿灯点亮
// 2秒后黄灯闪烁
// 1秒后红灯亮起