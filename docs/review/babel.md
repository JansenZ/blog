[min-babel中文版](https://github.com/YongzeYao/the-super-tiny-compiler-CN/blob/master/the-super-tiny-compiler.js)

1. babel

   babel 的处理流程是

   1. 先用词法分析，把源代码转换成 token
   2. 再用语法分析，把 token 词转换成 ast（抽象语法树）有一个[在线 bst](https://astexplorer.net/)可以在线看生成的 ast。在线写 babel 插件（@babel/parser）
   3. （@babel/traverse）接着就是**转换(Transform)**了，转换阶段会对 AST 进行遍历，在这个过程中对节点进行增删查改。Babel 所有插件都是在这个阶段工作, 比如语法转换、代码压缩。
   4. 代码生成，把 ast 转换成新的可运行的代码（@babel/generator）

   babel 执行的需要 babel/cli，cli 依赖 babel/core。

   插件在预设前运行。

   插件的执行顺序是从左到右

   ```js
   {
         "plugins": ["transform-decorators-legacy", "transform-class-properties"]
   }
   {
       "plugins": [
           ['xxxname',{"loose": true}]
       ]
   }
   ```

   如果加参数的话，就插件内数组加数组。

   自定义插件的话，就是处理自己想处理的那部分语言。

2. 如何用 babel 写一个自定义插件。

   进入 vistor 节点,比如我要替换 let 为 var，那就找到 VariableDeclaration 定义节点，然后进去后判断下 path.node.kind 是不是 let，如果是，改成 var 就可以了。具体的可以到 astexplorer 上学习一下。

   ```js
   visitor: {
   Identifier(path) {
       path.node.name = "_" + path.node.name;
   },
   VariableDeclaration(path) {
       if (path.node.kind == "let") {
       path.node.kind = "var";
       }
   },
   ```

   预设就是一堆插件的集合，预设的执行顺序是从右到左。最新的预设已经不需要什么 stage 了，就用的 env

   ```js
   //.babelrc
   {
       "presets": [
           [
               "@babel/preset-env",
               {
                   "useBuiltIns": "usage", // 用了这个可以按需引用用到的polyfill
                   "corejs": 3 //搭配使用的
               }
           ]
       ],
       "plugins": [
           "@babel/plugin-transform-runtime" // 用了这个可以节省很多重复的代码
       ]
   }
   ```
