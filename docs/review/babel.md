[min-babel 中文版](https://github.com/YongzeYao/the-super-tiny-compiler-CN/blob/master/the-super-tiny-compiler.js)

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
    const visitor = {
        Identifier(path) {
            path.node.name = '_' + path.node.name;
        },
        VariableDeclaration(path) {
            if (path.node.kind == 'let') {
                path.node.kind = 'var';
            }
        },
    };
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

3. babel 总体思路

    1. 词法分析， 创建 token 数组

        通过 charAt 一个一个的遍历字符串，把空格跳过

        如果是括号，可以 `push({ type: 'paren', value: '(' })`

        如果是数字，就需要记下来，然后 while 循环里继续正则匹配数字，直到不是数字的时候

        `tokens.push({ type: 'number', value });`

        其它复杂的情况也类似，最后生成一个 tokens 数组

    2. 预发分析，生成一个 ast

        遍历 tokens 数组，然后判断 tokens 里的每一个类型，生成一个 ast 树，比如遇到括号了，说明这应该是个嵌套，就需要递归去生成。

        最后结果就是`ast = {type: program: body: [{}]}`的形式

    3. 转换器方法

        转换器方法用来接收**ast 语法树**和一个**visit 节点**，然后判断当前的 node.type 是不是在节点上，存在就代表需要处理了，然后跑 method.enter 方法，递归判断，最后跑 method.exit 方法。

    4. 转换器

        自定义开发的就是这个，接收一颗旧的**ast 语法树**，创建一颗新的**ast 语法树**,调用刚刚的转换器方法，把 visit 对象传进去，比如判断是不是 letVariable，是的换改变。

        ```js
        traverser(ast, {
            // 访问者对象处理的第一种情况是`NumberLiteral`节点。
            NumberLiteral: {
                // 我们会在进入节点的时候访问节点。
                enter(node, parent) {
                    //我们创建一个`NumberLiteral`类型的新节点并添加到父节点的`context`。
                    parent._context.push({
                        type: 'NumberLiteral',
                        value: node.value,
                    });
                },
            },
        });
        ```
