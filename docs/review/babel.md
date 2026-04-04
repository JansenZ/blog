[min-babel 中文版](https://github.com/YongzeYao/the-super-tiny-compiler-CN/blob/master/the-super-tiny-compiler.js)

1. babel

    babel 的处理流程是

    1. 先用词法分析，把源代码转换成 token
    2. 再用语法分析，把 token 词转换成 ast（抽象语法树）有一个[在线 AST](https://astexplorer.net/)可以在线看生成的 ast。在线写 babel 插件（@babel/parser）
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

    2. 语法分析，生成一个 ast

        遍历 tokens 数组，然后判断 tokens 里的每一个类型，生成一个 ast 树，比如遇到括号了，说明这应该是个嵌套，就需要递归去生成。

        最后结果就是`ast = { type: 'Program', body: [{}] }`的形式

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

4. **`useBuiltIns: 'usage'` vs `'entry'` 的区别**

    两者都是配合 `core-js` 自动注入 polyfill 的方式，但时机不同：

    - **`'entry'`**：需要你在入口文件手动 `import 'core-js'`，Babel 会根据目标浏览器把这一行展开成所有需要的 polyfill。粒度粗，打包体积偏大。
    - **`'usage'`**：不需要手动 import，Babel 分析你代码里实际**用到了哪些** API，按需注入对应的 polyfill。粒度细，体积小，推荐使用。

    ```js
    // useBuiltIns: 'entry' 需要在入口手动写
    import 'core-js'; // Babel 会把这行替换成几十行具体的 polyfill

    // useBuiltIns: 'usage' 不需要手动写，Babel 自动分析注入
    // 你代码里用了 Promise.allSettled，Babel 自动加上对应 polyfill
    ```

    注意：`useBuiltIns` 和 `@babel/plugin-transform-runtime` 的 `corejs` 选项**不能同时使用**，会冲突。前者污染全局（适合业务项目），后者用局部变量（适合库/组件）。

5. **`@babel/plugin-transform-runtime` 到底做了什么**

    Babel 转换代码时会注入一些辅助函数（helper），比如转换 class 时会注入 `_classCallCheck`、`_createClass` 等。如果每个文件都内联这些 helper，会有大量重复代码。

    `@babel/plugin-transform-runtime` 做了两件事：

    - **复用 helper**：把内联的 helper 改成从 `@babel/runtime` 引用，所有文件共享一份，减少体积。
    - **不污染全局的 polyfill**（需配置 `corejs: 3`）：用局部变量替代全局 polyfill，适合开发库/组件，避免影响用户的全局环境。

    ```js
    // 没有 transform-runtime：每个文件都内联 helper（重复）
    function _classCallCheck(instance, Constructor) { ... } // 每个文件都有这个

    // 有 transform-runtime：统一从 runtime 包引用
    var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
    ```

6. **`babel.config.js` vs `.babelrc` 的区别**

    两者都是 Babel 配置文件，但作用范围不同：

    | 对比 | `babel.config.js` | `.babelrc` |
    |------|-------------------|------------|
    | 作用范围 | 整个项目（含 node_modules）| 只对所在目录及子目录生效 |
    | 适用场景 | Monorepo、全局配置 | 单包项目、局部覆盖 |
    | 格式 | JS（可以写逻辑）| JSON（静态配置）|

    Monorepo 场景下，根目录放 `babel.config.js` 做全局配置，子包里放 `.babelrc` 覆盖特定配置，两者可以共存。

7. **Babel 处理 TypeScript 和 JSX**

    Babel 有两种处理 TS 的方式，和 `tsc` 不同：

    - **`@babel/preset-typescript`**：Babel 直接**剥离**类型注解，不做类型检查，速度极快。缺点是编译时不报类型错误，需要另外跑 `tsc --noEmit` 做类型检查。
    - **`tsc`**：真正编译 TypeScript，有类型检查，但慢。

    现代项目（Vite、CRA、Next.js）基本都用 Babel/esbuild 处理 TS（只剥离类型，不检查），CI 阶段单独跑 `tsc` 检查类型，两步分离，开发体验和类型安全两不误。

    ```js
    // babel.config.js 同时支持 TS 和 JSX
    {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-typescript",  // 处理 .ts/.tsx
            "@babel/preset-react"        // 处理 JSX → React.createElement
        ]
    }
    ```

    `@babel/preset-react` 在 React 17+ 可以开启新的 JSX transform，不需要在每个文件 `import React`：
    ```js
    ["@babel/preset-react", { "runtime": "automatic" }]
    ```

8. **AST 在 AI 代码场景中的应用**

    AST 不只是 Babel 的内部实现，它是 AI 代码工具的重要基础设施。

    **AI 代码生成（Copilot / Cursor）：**
    LLM 生成代码后，往往需要 AST 做后处理：
    - 语法合法性校验：把生成的代码 parse 成 AST，如果 parse 失败说明语法错误，触发重新生成
    - 代码插入定位：用 AST 精确找到插入点（比如"在这个函数后面加一个方法"），而不是基于字符串搜索

    **AI 代码审查 / 重构 Agent：**
    ```
    源代码 → AST → 分析节点（找到所有 var 声明 / 找到循环嵌套超过3层的函数）→ 把问题节点信息喂给 LLM → LLM 给出修改建议 → 基于 AST 精确修改 → 生成新代码
    ```
    这比"把整个文件扔给 LLM 让它改"更精准、token 消耗更少。

    **Codemod（自动化代码迁移）：**
    大型项目升级（React 16→18、Vue 2→3）时，AI Agent 可以结合 Babel AST 写 codemod 脚本批量迁移，而不是逐文件人工改。原理和自定义 Babel 插件一样，用 `@babel/traverse` 找到旧 API 调用节点，自动替换成新 API。

    ```js
    // 示例：用 Babel AST 把所有 componentWillMount 批量改成 componentDidMount
    traverse(ast, {
        ClassMethod(path) {
            if (path.node.key.name === 'componentWillMount') {
                path.node.key.name = 'componentDidMount';
            }
        },
    });
    ```
