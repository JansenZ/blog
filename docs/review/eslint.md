### Q1: 什么是 ESLint？

ESLint 是一个用于识别和报告 JavaScript 代码中的问题的静态代码分析工具。它的主要作用是帮助开发者发现和修复代码中的错误和不规范之处，从而提高代码质量和一致性。

主要作用包括：

1. 发现语法错误：ESLint 可以检测代码中的语法错误，帮助开发者在编译之前发现问题。
2. 强制执行编码规范：通过配置规则，ESLint 可以强制团队遵循一致的编码风格和最佳实践。
3. 提高代码质量：通过发现潜在的错误和不良实践，ESLint 可以帮助开发者编写更健壮和可维护的代码。
4. 自动修复问题：ESLint 可以自动修复一些简单的问题，减少开发者的工作量。

### Q2: 为什么要写一个自定义的 ESLint 插件？

为啥要写，我觉得有两点：

1. 满足特定需求

   - 有时，现有的 ESLint 规则无法完全满足项目的需求
   - 比如基因链是我们自有项目，很多是依赖业务逻辑的
   - 这个时候只有通过编写自定义插件来强制执行项目中的特定编码规范，从而提高我们的代码质量

2. 团队一致性
   - 每个团队可能有自己独特的编码风格和最佳实践
   - 自定义插件可以帮助团队保持一致性
   - 确保所有成员都遵循相同的编码标准

## 二、技术实现

### Q3: ESLint 插件工作原理是什么？

A: ESLint 插件的工作原理分为四个主要步骤：

1. 解析代码

   - ESLint 首先会使用解析器（如 Espree）将 JavaScript 代码解析成抽象语法树（AST 源码位置）
   - AST 是一种树状结构，表示代码的语法结构
   - 把代码抽象成树状数据结构，会方便后续分析检测代码

2. 遍历 AST

   - ESLint 会遍历 AST 中的每个节点，并根据配置的规则对节点进行检查
   - 每个规则都是一个函数，接收节点作为参数，并根据节点的类型和内容进行相应的检查

   ```javascript
   const estraverse = require('estraverse')
   estraverse.traverse(ast, {
     enter(node) {
       console.log('Entering node:', node.type)
     },
     leave(node) {
       console.log('Leaving node:', node.type)
     },
   })
   ```

3. 报告问题

   - 在深度遍历的过程中，生效的每条规则都会对其中的某一个或多个选择器进行监听
   - 每当匹配到选择器，监听该选择器的 rule，都会触发对应的回调
   - 如果规则函数发现了问题，它会通过上下文对象（context）报告这些问题
   - 上下文对象提供了报告问题、获取配置信息等功能

   ```javascript
   context.report({
     node,
     message: '不行不行不行不行',
     fix: function (fixer) {
       return fixMethod(node)
     },
   })
   ```

4. 自动修复
   - 一些规则可以提供自动修复功能
   - 通过上下文对象，规则函数可以指定如何修复发现的问题
   - ESLint 会根据这些修复建议自动修改代码
   - 比如直接帮你删除某个节点，或者挪到其他位置等等

### Q4: 如何写一个 ESLint 插件？

A: 编写插件之前，需要对插件有一个足够的了解，我们的目的就是写一个单条 rule，官方文档中 custom-rules 一节中也有详细的介绍。

1. 如何配置插件

   ```javascript
   module.exports = {
     ...,
     plugins: [
       'prettier',
       'simple-import-sort',
       '@microsoft/eslint-plugin-sdl',
       '你的插件'
       ...
     ],
     // add your custom rules here
     rules: {
       'nuxt/no-cjs-in-config': 'off',
       'no-console': 'off',
       '你的规则': 'error'
       ...
     }
   }
   ```

   本期讲插件，所以只看插件的配置方面，只需要把第 8 行和第 16 行加入就搞定了，多么的简单。每条规则都是独立的，且都可以被设置为禁止 off，警告 warn⚠️，或者报错 error❌。

2. 编写插件

   编写插件之前，需要对插件有一个足够的了解，我们的目的就是写一个单条 rule，官方文档中 custom-rules 一节中也有详细的介绍。这里我们选用一条规则来看看到底是怎么写的。

   ```javascript
   'use strict'
   const DEFAULT_BLOCKLIST = [/^(ftp|http|telnet|ws):\/\//i]

   const DEFAULT_EXCEPTIONS = [
     // TODO: add more typical false positives such as XML schemas after more testing
     /^http:(\/\/|\\u002f\\u002f)schemas\.microsoft\.com(\/\/|\\u002f\\u002f)?.*/i,
     /^http:(\/\/|\\u002f\\u002f)schemas\.openxmlformats\.org(\/\/|\\u002f\\u002f)?.*/i,
     /^http:(\/|\\u002f){2}localhost(:|\/|\\u002f)*/i,
   ]

   module.exports = {
     meta: {
       type: 'suggestion',
       fixable: 'code',
       schema: [
         {
           type: 'object',
           properties: {
             blocklist: {
               type: 'array',
               items: {
                 type: 'string',
               },
             },
             exceptions: {
               type: 'array',
               items: {
                 type: 'string',
               },
             },
           },
           additionalProperties: false,
         },
       ],
       docs: {
         category: 'Security',
         description:
           'Insecure protocols such as [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) or [FTP](https://en.wikipedia.org/wiki/File_Transfer_Protocol) should be replaced by their encrypted counterparts ([HTTPS](https://en.wikipedia.org/wiki/HTTPS), [FTPS](https://en.wikipedia.org/wiki/FTPS)) to avoid sending (potentially sensitive) data over untrusted network in plaintext.',
         url:
           'https://github.com/microsoft/eslint-plugin-sdl/blob/master/docs/rules/no-insecure-url.md',
       },
       messages: {
         doNotUseInsecureUrl: 'Do not use insecure URLs',
       },
     },
     create: function (context) {
       const options = context.options[0] || {}
       const blocklist = (options.blocklist || DEFAULT_BLOCKLIST).map(
         (pattern) => {
           return new RegExp(pattern, 'i')
         }
       )
       const exceptions = (options.exceptions || DEFAULT_EXCEPTIONS).map(
         (pattern) => {
           return new RegExp(pattern, 'i')
         }
       )

       function matches(patterns, value) {
         return (
           patterns.find((re) => {
             return re.test(value)
           }) !== undefined
         )
       }

       return {
         Literal(node) {
           if (typeof node.value === 'string') {
             // Add an exception for xmlns attributes
             if (
               node.parent &&
               node.parent.type === 'JSXAttribute' &&
               node.parent.name &&
               node.parent.name.name === 'xmlns'
             ) {
               // Do nothing
             } else if (
               matches(blocklist, node.value) &&
               !matches(exceptions, node.value)
             ) {
               context.report({
                 node: node,
                 messageId: 'doNotUseInsecureUrl',
               })
             }
           }
         },
         TemplateElement(node) {
           if (
             typeof node.value.raw === 'string' &&
             typeof node.value.cooked === 'string'
           ) {
             const rawStringText = node.value.raw
             const cookedStringText = node.value.cooked

             if (
               (matches(blocklist, rawStringText) &&
                 !matches(exceptions, rawStringText)) ||
               (matches(blocklist, cookedStringText) &&
                 !matches(exceptions, cookedStringText))
             ) {
               context.report({
                 node: node,
                 messageId: 'doNotUseInsecureUrl',
               })
             }
           }
         },
       }
     },
   }
   ```

不到 100 行，就可以完成代码中 https 的监控。这还算是一个稍微复杂一点的例子。

可以看到，一条 rule 就是导出一个对象，其主要由 meta 和 create 两部分组成。

#### Meta 配置详解

meta 属性包含了规则的元数据，用于描述规则的基本信息和配置选项。也就是说，配置是比较灵活的，想怎么写怎么写，它通常包括以下几个子属性：

1. type

   - problem: 表示代码中的实际问题，如语法错误或潜在的运行时错误
   - suggestion: 表示代码中的改进建议，如代码风格或最佳实践
   - layout: 表示与代码布局和格式相关的问题

2. docs

   - description: 对规则的简要描述
   - recommended: 指示规则是否为推荐规则，值为 true 或 false
   - url: 规则的详细文档链接

3. fixable

   - code: 表示规则可以通过修改代码来自动修复
   - whitespace: 表示规则可以通过修改空白字符来自动修复

4. schema

   - 用于定义规则的配置选项的 JSON Schema
   - 描述了规则的配置结构和类型
   - 确保用户在配置规则时提供的选项是有效的

5. messages
   - 定义了规则的错误信息
   - 它是一个对象，键是消息 ID，值是对应的错误信息字符串

#### Create 函数详解

如果说 meta 表达了我们想做什么，那么 create 则用表达了这条 rule 具体会怎么分析代码。create 接受一个 context 对象，返回一个对象，该对象包含各种节点类型的处理函数，在解析代码的时候，就会被调用。然后我们通过 context.report 进行处理即可，那常见的节点类型，就直接参考 AST 语法树就可以了，以下常见的有：

- Program: 整个脚本或模块
- FunctionDeclaration: 函数声明
- VariableDeclaration: 变量声明
- ExpressionStatement: 表达式语句
- CallExpression: 函数调用表达式
- Identifier: 标识符
- Literal: 字面量，如字符串、数字等
- TemplateElement: 模版字符串中的静态部分
- BinaryExpression: 二元表达式，如 a + b
- IfStatement: if 语句
- ForStatement: for 循环
- WhileStatement: while 循环
- ReturnStatement: return 语句

## 三、实践案例

### Q5: 如何测试和发布 ESLint 插件？

A: 测试和发布流程如下：

1. 测试方法

   ```javascript
   const { RuleTester } = require('eslint')
   const rule = require('../../../lib/rules/require-h-parameter')

   const ruleTester = new RuleTester()

   ruleTester.run('require-h-parameter', rule, {
     valid: [
       {
         code: 'const renderSomething = (h) => {}',
       },
       {
         code: 'function renderSomething(h) {}',
       },
       {
         code: 'class Test { renderSomething(h) {} }',
       },
     ],
     invalid: [
       {
         code: 'const renderSomething = () => {}',
         errors: [{ messageId: 'noIncludeH' }],
         output: 'const renderSomething = (h) => {}',
       },
       {
         code: 'function renderSomething() {}',
         errors: [{ messageId: 'noIncludeH' }],
         output: 'function renderSomething(h) {}',
       },
       {
         code: 'class Test { renderSomething() {} }',
         errors: [{ messageId: 'noIncludeH' }],
         output: 'class Test { renderSomething(h) {} }',
       },
     ],
   })
   ```

2. 发布步骤
   - 本地调试：使用 `npm link` 进行本地测试
   - 发布准备：确保 `package.json` 配置正确
   - 发布命令：执行 `npm publish`
