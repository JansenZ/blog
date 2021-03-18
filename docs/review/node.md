
browser-sync start --server --files "_._"

- EventEmitter 事件模块 on,off,removeListener,emit

- setImmediate,
- process.nextTick,
- path.dirname 获取路径目录
- path.extname 获取路径扩展名
- path.basename 获取路径的那个文件名 index.js
- path.isAbsolute 是否是绝对路径
- path.join 拼接路径,中间的/不用写，会自动带的
- path.resolve 把路径解析成绝对路径，遇到./的，正常拼接，遇到../的直接替换前面一级，遇到/的，就直接停止。
  - path.resolve('/foo/bar', './baz') // returns '/foo/bar/baz'
  - path.resolve('/foo/bar', 'baz') // returns '/foo/bar/baz'
  - path.resolve('/foo/bar', '/baz') // returns '/baz'
  - path.resolve('/foo/bar', '../baz') // returns '/foo/baz'
  - path.resolve('home','/foo/bar', '../baz') // returns '/foo/baz'
  - path.resolve('/home','./foo/bar', '../baz') // returns '/home/foo/baz'
  - path.resolve('home','foo/bar', '../baz') // returns '/home/foo/baz'
- path.normalize 规范路径，把中间多余的/给去掉
  path.normalize('/path///example/index.js') // /path/example/index.js
- path.parse 解析路径，生成一个路径对象
  ```js
  path.parse('/path/example/index.js')
  {
      root: '/',
      dir: '/path/example',
      base: 'index.js',
      ext: '.js',
      name: 'index'
  }
  ```
- path.format 序列化路径，把对象转成路径
  ```js
  path.format({
      root: '/',
      dir: '/path/example',
      base: 'index.js',
      ext: '.js',
      name: 'index'
  }) // /path/example/index.js
  ```
- path.relative 获取相对路径
  path.relative('/path/example/index.js', '/path') // ../..
- fs 文件模块（扩展库 fs-extra）
  读取文件 没有的话会报错。

  ```js
  fs.readFile('./index.txt', 'utf8', (err, data) => { // 异步读取
      console.log(data) //  Hello Nodejs
  })
  const data = fs.readFileSync('./index.txt', 'utf8') //  Hello Nodejs // 同步读取

  const stream = fs.createReadStream('./index.txt', 'utf8') // 创建读取流
  stream.on('data', data => {
      console.log(data) // Hello Nodejs 流的话是一段一段的取的，文件大的话会进来很多次。
  })
  ```

  写入文件，如果没有找到文件会创建一个文件。

  ```js
  const fs = require('fs')
  fs.writeFile('./write.txt', 'Hello Nodejs', 'utf8', err => {     // 异步写入
      if (err) throw err
  })
  fs.writeFileSync('./writeSync.txt', 'Hello Nodejs')     // 同步写入
  const ws = fs.createWriteStream('./writeStream.txt', 'utf8')     // 文件流写入
  ws.write('Hello Nodejs')
  ws.end()
  ```

  删除操作,如果没有文件了，执行删除会报错

  ```js
  fs.unlink('./delete.txt', err => {// 异步删除文件
      if (err) throw err
  })
  fs.unlinkSync('./deleteSync.txt')  // 同步删除文件
  fs.rmdir,异步删除文件夹。 fs.rmdirSync， 同步删除文件夹
  ```

  创建文件 fs.mkdir, fs.mkdirSync

  重命名文件/文件夹 fs.renameSync(from, to); fs.rename('from', to);

  复制文件 fs.copyFile(from, to); fs.copyFileSync(from, to);

  获取文件状态 fs.stat/ fs.statSync

- process 全局对象进程，它是一个 eventEmitter 的实例 process.**proto**.**proto** == EventEmitter.prototype 是 true
  process.argv, 进程命令行参数，第一个参数是 node，第二个是文件路径，第三个是命令带的参数
  - node index.js --tips="hello nodejs"
  - /\*
  - [ '/usr/local/bin/node',
  - 'xxx/process/index.js',
  - '--tips=hello nodejs' ]
  - \*/
  - .version 当前 node 编辑时的版本
  - .pid 当前进程的 pid
  - .cwd() 进程当前的工作目录
  - .exit(pid) 终止当前进程
  - .nextTick() 微任务，如果没有会 polyfill 到 settimeout 0
  - process.stderr 是一个指向标准错误流的可写流 Writable Stream。console.error 就是通过 process.stderr 实现的。
  - process.stdin 是一个指向标准输入流的可读流 Readable Stream。
  - process.stdout 是一个指向标准输出流的可写流 Writable Stream。console.log 就是通过 process.stdout 实现的
- http 模块，可以通过其方法创建一个 HTTP 服务器
  ```js
  http.createServer((req, res)=>{
      //req是一个incomemessage实例，可以处理来自客户端的状态，头文件，数据等。
      // res 是一个serverresponse实例，也是一个eventemmiter。它可以写文件。
      req处理头， req也可以监听,on ,end
      res.写数据
  })
  server.listen(3333); 监听
  ```
- URL 模块

  url 里可以对 url 进行操作。
  const myURL = new URL("https://github.com/webfansplz#hello");
  myUrl 就是一个对象。里面有 url 的信息。

- 压缩 zlib 模块

  gzip = gzip 头+ deflate + gzip 尾
  文件压缩， createGzip, 解压就是 createGunzip;
  const zlib = require('zlib')
  const fs = require('fs')
  const gzip = zlib.createGzip()
  const inp = fs.createReadStream('zlib.txt')
  const out = fs.createWriteStream('zlib.txt.gz')
  inp.pipe(gzip).pipe(out)
  服务端压缩就是在 http 进来后，gzip req

exports 和 module.exports

module.exports = {} ,其实和 exports.xx 一样。就是 exports.xx 要写多次。
但是 module.exports = ()=>{} ，可以直接导出一个默认 function。

nodejs 节水怪

1. 简单直观的来讲 Node 就是脱离了浏览器的，但仍然基于 Chrome V8 引擎的一个 JavaScript 的运行环境。
2. 轻量、高效、事件驱动、非阻塞 I/O 是 Node 几个很重要的特性
3. node 下层，由几个组成
   1. V8 引擎
   2. C-ares，一个由 C 语言实现的异步 DNS 请求库；
   3. http_parser、OpenSSL、zlib 等，提供一些其他的基础能力。
   4. libuv 是一个高性能的，事件驱动的 I/O 库，并且提供了跨平台（如 Windows、Linux）的 API。它强制使用异步的，事件驱动的编程风格，核心工作就是提供一个 event loop，还有基于 I/O 和其它事件通知的回调函数。并且还提供了一些核心工具，例如定时器，非阻塞的网络支持，异步文件系统访问，子进程等。
4. Node 除了 JavaScript 的部分是单线程外，很多地方都是多线程的。
5. Node 的 I/O 操作实际上是交给 libuv 来做的，而 libuv 提供了完整的线程池实现。所以，除了用户的 JavaScript 代码无法并行执行以外，所有的 I/O 操作都是可以并行的。
6. 操作系统中对于 I/O 只有两种处理方式，即阻塞和非阻塞。阻塞 I/O 即为调用之后需要等待完成所有操作后，调用才结束，这就造成了 CPU 一直在等待 I/O 结束，处理能力得不到充分利用。而非阻塞 I/O 是调用后，它会返回一个状态，告诉你没完成，你这时候可以调用其他的。为了获取最终结果，应用程序需要充分调用判断操作是否完成，即轮询。
7. node 虽然是单线程的，但是为了利用性能，Node.js 中用来解决单线程中 CPU 密集任务的方法很粗暴，那就是直接开子进程，通过 child_process 将计算任务分发给子进程，再通过进程之间的事件消息来传递结果，也就是进程间通信。（Node 中是采用管道的方式进行通信的哦~）
8. 每个事件循环中都会有观察者，判断是否有要处理的事件就是向这些观察者询问。在 Node.js 中，事件来源主要有网络请求，文件 I/O 等，这些事件都会对应不同的观察者。
9. 事件循环、观察者、请求对象、I/O 线程池共同构成了 Node 的事件驱动异步 I/O 模型。
10. 调用 child_process.fork 创建子进程，被 fork 出的进程为 worker。通常会阻塞的操作分发给 worker 来执行（查 db，读文件，进程耗时的计算等等），master 上尽量编写非阻塞的代码。
11. 进程之间是要有通信的。node 是通过管道。实现通信。一个管道创建后，一边用于读，一边用于写。那么一个不够，所以两个进程间需要两个管道来完成双边通信。
