//this.xxx.bind(this,sss,xxx);
// bind 返回新函数，实际就是换了个this。也就是apply把新的context放进去就可以了
Function.prototype.bind2 = function(context, args) {

    let self = this;

    let res = function(arg2s) {
        self.apply(context,args.concat(arg2s));
    }

    res.prototype = Object.create(self.prototype);

    return res;
}
// 首先，我们为什么要加原型，因为bind出来的function是可以new的，并且还要指向原来的函数，所以需要原型
// 其次，为啥下面的改成用空函数呢，因为上面的写法，如果修改了res.prototype,一样会改 到原函数的原型。所以用下面的中转一下。
Function.prototype.bind2 = function(ctx, args1) {
    const self = this;

    const Fn = function() {}

    const res = function() {
        self.apply(ctx, args1.concat(args2));
    }
    
    Fn.prototype = self.prototype;

    res.prototype = new Fn();

    return res;
}