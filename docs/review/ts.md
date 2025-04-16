类型体操[https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md]

### 1. TypeScript 和 JavaScript 有哪些主要区别？

<details>
<summary>展开答案</summary>

- **静态类型检查**：JavaScript 是动态类型语言，变量类型在运行时确定，这可能导致运行时出现类型相关错误。而 TypeScript 是静态类型语言，在编译阶段就会进行类型检查，能提前发现很多类型错误，提高代码的可靠性和可维护性。
- **语法扩展**：TypeScript 在 JavaScript 基础上增加了类型注解、接口、枚举等语法，让代码结构更清晰，易于理解和维护。
- **编译步骤**：JavaScript 代码可以直接在浏览器或 Node.js 环境中运行，而 TypeScript 代码需要先编译成 JavaScript 代码才能运行。

</details>

### 2. 请列举 TypeScript 中的基本数据类型都有什么？

<details>
<summary>展开答案</summary>

- **number**：表示数值类型，包括整数和浮点数，如 `let num: number = 10;`。
- **string**：表示文本类型，如 `let str: string = "hello";`。
- **boolean**：表示布尔类型，只有两个值 `true` 和 `false`，如 `let isDone: boolean = false;`。
- **null**：表示空值，只有一个值 `null`，如 `let n: null = null;`。
- **undefined**：表示未定义的值，只有一个值 `undefined`，如 `let u: undefined = undefined;`。
-
- **any**：表示任意类型，当你不确定变量的具体类型时可以使用，如 `let value: any = "hello"; value = 10;`。
- **void**：通常用于函数没有返回值的情况，如 `function sayHello(): void { console.log("Hello"); }`。
- **never**：TypeScript 中的 never 类型表示永远不会出现的值（如抛出异常或无限循环的函数），比如一个函数，根本不可能走完，因为你抛出异常了，这个时候就可以给它的返回值写 never
- **unknown**：TypeScript 中的 unknown 类型表示未知类型，必须经过类型检查后才能使用，比如需要类型检查的时候，参数可以先写 unknown
- **Tuple**：元组类型，表示一个已知数量和类型的数组，这个不算是基础类型吧，`let person: [string, number] = ["Alice", 25];`,要求你固定顺序且固定类型

</details>

### 3. 简述 interface（接口）和 type（类型别名）的主要作用，它们有什么不同之处？

<details>
<summary>展开答案</summary>

- **主要作用**：
  - **interface**：用于定义对象的形状，描述对象的属性和方法的类型。可以实现继承，用于类的实现。
  - **type**：可以定义各种类型，包括基本类型、联合类型、交叉类型、函数类型等，更灵活、更复杂
- **不同之处**：
  - **语法**：interface 使用 `interface` 关键字定义，type 使用 `type` 关键字定义。
  - **扩展性**：interface 可以重复定义，会自动合并，而 type 一旦定义不能重复定义。
  - **定义类型范围**：interface 主要用于定义对象类型，type 可以定义更广泛的类型。
- **使用场景**：
  - **interface**：适合定义对象类型和类实现。一般来说，能用 interface，都用 interface，当 interface 搞不定的时候，再考虑 type
  - **type**：适合定义更广泛的类型，包括联合类型、交叉类型、函数类型等。

</details>

### 4. 什么是泛型？在 TypeScript 中使用泛型有什么好处？请举例说明

<details>
<summary>展开答案</summary>

- **泛型定义**：泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而是在使用的时候再指定类型的一种特性。
- **好处**：
  - **代码复用**：可以编写通用的函数、接口或类，提高代码的复用性。
  - **类型安全**：在编译阶段进行类型检查，保证类型的正确性。
- **示例**：

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>('myString');
let output2 = identity<number>(100);

function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}
const arr = [1, 2, 3];
const firstNumber = getFirstElement(arr);
```

</details>

### 5. 如何在 TypeScript 中处理可空类型（null 和 undefined）？

<details>
<summary>展开答案</summary>

- **可选参数和可选属性**：在参数或属性后面加 `?` 表示可选，可能为 `undefined`。

```typescript
function printName(name?: string) {
    if (name) {
        console.log(name);
    }
}
```

- **联合类型**：使用 `|` 组合类型，如 `string | null | undefined`。

```typescript
let value: string | null | undefined;
if (value !== null && value !== undefined) {
    console.log(value.length);
}
```

- **非空断言操作符**：使用 `!` 断言变量不为 `null` 或 `undefined`。

```typescript
let value: string | null = 'hello';
let length = value!.length;
```

</details>

### 6. 解释一下 unknown 类型和 any 类型的区别，并举例说明在什么场景下使用它们

<details>
<summary>展开答案</summary>

- **区别**：
  - **any**：可以赋值给任意类型，也可以接收任意类型的值，使用 `any` 会绕过类型检查，失去类型安全。
  - **unknown**：表示未知类型，不能直接赋值给其他类型，需要进行类型检查或类型断言后才能使用，更安全。
- **使用场景**：
  - **any**：当你无法确定类型且不想处理类型检查时可以使用，但应尽量避免。
  - **unknown**：当从外部获取数据，不确定数据类型时使用，在使用前进行类型检查。

```typescript
function processValue(value: unknown) {
    if (typeof value === 'string') {
        console.log(value.toUpperCase());
    }
}
```

</details>

### 7. 描述一下 keyof 操作符的作用，它在实际开发中有哪些应用场景？

<details>
<summary>展开答案</summary>

- **作用**：`keyof` 操作符用于获取一个类型的所有属性名组成的联合类型。
- **应用场景**：
  - **类型安全的属性访问**：可以确保访问的属性名是合法的。
  - **泛型约束**：在泛型中约束类型的属性。

```typescript
interface Person {
    name: string;
    age: number;
}

type PersonKeys = keyof Person; // "name" | "age"

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let person: Person = { name: 'John', age: 30 };
let name = getProperty(person, 'name');
```

</details>

### 8. 实现一个简单的函数重载的例子，并说明函数重载在 TypeScript 中的作用

<details>
<summary>展开答案</summary>

- **示例**：

```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
    return a + b;
}

let result1 = add(1, 2);
let result2 = add('hello', ' world');
```

- **作用**：函数重载允许一个函数接受不同类型和数量的参数，根据不同的参数类型和数量提供不同的实现，提高函数的灵活性和可读性。正常来说确实没啥用，就多了个签名，实现还是要区分，它不像 Java 的重载，人家那个才是真正的重载。

</details>

### 9. 什么是类型断言？在什么情况下需要使用类型断言？使用时要注意什么？

<details>
<summary>展开答案</summary>

- **类型断言定义**：类型断言是一种告诉编译器某个变量的具体类型的方式，它不会改变变量的实际类型，只是在编译阶段进行类型检查。
- **使用场景**：
  - 当你比编译器更了解某个变量的类型时。
  - 从 `any` 或 `unknown` 类型转换为具体类型。
  - 还有如果遇到类似于函数重载，然后里面要使用到类型检查的时候，由于 typeof 都是动态检查，所以返回值必须要靠类型断言来确保类型安全。
- **注意事项**：类型断言只是一种编译时的提示，不会进行运行时的类型检查，如果断言错误可能会导致运行时错误。反正别滥用就对了。

```typescript
let value: any = 'hello';
let length = (value as string).length;
```

</details>

### 10. 请解释 Readonly<T>工具类型的作用，如何使用它将一个对象的属性变为只读？

<details>
<summary>展开答案</summary>

- **作用**：`Readonly<T>` 工具类型用于将一个类型的所有属性变为只读，防止属性被修改。
- **使用方法**：

```typescript
interface Person {
    name: string;
    age: number;
}

let readonlyPerson: Readonly<Person> = { name: 'John', age: 30 };
// readonlyPerson.age = 31; // 报错，属性只读

// 自己实现一个
type myReadonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

</details>

### 11. 如何使用 Partial<T>工具类型将一个对象的属性变为可选属性？请举例说明

<details>
<summary>展开答案</summary>

- **作用**：`Partial<T>` 工具类型用于将一个类型的所有属性变为可选属性。
- **使用方法**：

```typescript
interface Person {
    name: string;
    age: number;
}

let partialPerson: Partial<Person> = { name: 'John' };

// 自己实现一个
type myPartial<T> = {
    [P in keyof T]?: T[P];
};
```

</details>

### 12. 介绍一下 Pick<T, K>工具类型的功能，以及它在实际项目中的应用场景

<details>
<summary>展开答案</summary>

- **功能**：`Pick<T, K>` 工具类型用于从一个类型 `T` 中选取部分属性 `K` 组成一个新的类型。
- **应用场景**：当你只需要一个对象的部分属性时，可以使用 `Pick` 来创建一个新的类型。

```typescript
interface Person {
    name: string;
    age: number;
    address: string;
}

type NameAndAge = Pick<Person, 'name' | 'age'>;

let person: NameAndAge = { name: 'John', age: 30 };

// 自己实现一个
type myPick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

</details>

### 13. 描述 Exclude<T, U>和 Extract<T, U>工具类型的作用，并分别给出一个使用示例

<details>
<summary>展开答案</summary>

- **Exclude<T, U>**：从类型 `T` 中排除可以赋值给类型 `U` 的类型。

```typescript
type T = 'a' | 'b' | 'c';
type U = 'b';
type Result = Exclude<T, U>; // "a" | "c"

// 自己实现一个
type myExclude<T, U> = T extends U ? never : T;
```

- **Extract<T, U>**：从类型 `T` 中提取可以赋值给类型 `U` 的类型。

```typescript
type T = 'a' | 'b' | 'c';
type U = 'b' | 'd';
type Result = Extract<T, U>; // "b"

// 自己实现一个
type myExtract<T, U> = T extends U ? T : never;
```

</details>

### 14. 什么是枚举（enum）？在 TypeScript 中使用枚举有什么优缺点？

<details>
<summary>展开答案</summary>

- **枚举定义**：枚举是一种定义一组命名常量的方式，方便代码的阅读和维护。

```typescript
enum Color {
    Red,
    Green,
    Blue
}

let c: Color = Color.Green;
```

- **优点**：
  - 提高代码的可读性和可维护性，使用有意义的名称代替数字或字符串。
  - 提供类型检查，确保使用的值是枚举中的合法值。
- **缺点**：
  - 增加了代码的复杂度，尤其是嵌套枚举或复杂枚举。
  - 编译后会生成额外的代码，增加了文件大小。

</details>

### 15. 如何在 TypeScript 中定义一个类？类的访问修饰符（public、private、protected）有什么作用和区别？

<details>
<summary>展开答案</summary>

- **类的定义**：

```typescript
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

let person = new Person('John', 30);
person.sayHello();
```

- **访问修饰符**：
  - **public**：默认的访问修饰符，属性和方法可以在类的内部和外部访问。
  - **private**：属性和方法只能在类的内部访问，外部无法访问。
  - **protected**：属性和方法可以在类的内部和子类中访问，外部无法访问。

</details>

### 16. 解释一下 TypeScript 中的模块系统，如何进行模块的导入和导出操作？

<details>
<summary>展开答案</summary>

- **模块系统**：TypeScript 采用了 ES6 的模块系统，将代码分割成多个文件，每个文件就是一个模块。模块可以导出和导入变量、函数、类等。
- **导出操作**：使用 `export` 关键字导出模块中的内容。

```typescript
// math.ts
export function add(a: number, b: number) {
    return a + b;
}
```

- **导入操作**：使用 `import` 关键字导入模块中的内容。

```typescript
// main.ts
import { add } from './math';

let result = add(1, 2);
```

</details>

### 17. 什么是映射类型（Mapped Type）？请举例说明如何使用映射类型来创建新的类型

<details>
<summary>展开答案</summary>

- **映射类型定义**：映射类型是一种基于现有类型创建新类型的方式，通过遍历现有类型的属性并对每个属性进行转换。
- **示例**：

```typescript
interface Person {
    name: string;
    age: number;
}

type ReadonlyPerson = {
    readonly [P in keyof Person]: Person[P];
};

let readonlyPerson: ReadonlyPerson = { name: 'John', age: 30 };
// readonlyPerson.age = 31; // 报错，属性只读
```

</details>

### 18. 描述一下条件类型（Conditional Types）的概念和语法，并举一个实际的例子

<details>
<summary>展开答案</summary>

- **概念**：条件类型允许根据一个条件来选择不同的类型。
- **语法**：`T extends U ? X : Y`，如果 `T` 可以赋值给 `U`，则类型为 `X`，否则为 `Y`。
- **分布式条件类型和普通条件类型的区别**：分布式条件类型可以处理联合类型，而普通条件类型只能处理基本类型。
- **示例**：

```typescript
type IsString<T> = T extends string ? true : false;

type Result1 = IsString<string>; // true
type Result2 = IsString<number>; // false

type T = 'a' | 'b' | 'c';
type U = 'b';
type Result = Exclude<T, U>; // "a" | "c"
// 这里的T是联合类型，它会挨个把a,b,c带入进去和U匹配，这就是分布式条件类型
type myExclude<T, U> = T extends U ? never : T;
```

</details>

### 19. 如何在 TypeScript 项目中配置 tsconfig.json 文件？其中一些常见的配置项都有什么作用？

<details>
<summary>展开答案</summary>

- **配置方法**：在项目根目录下创建 `tsconfig.json` 文件，通过 JSON 格式配置 TypeScript 编译器的选项。
- **常见配置项**：
    1. **target**：指定编译后的 JavaScript 版本，如 `ES5`、`ES6`、`ESNEXT` 等。
    2. **module**：指定模块系统，如 `commonjs`、`esnext` 等。
    3. **strict**：启用所有严格类型检查选项。
    4. **outDir**：指定编译后文件的输出目录。
    5. **path**：指定需要编译的文件路径。
    6. **baseUrl**：设置模块解析的基准路径
     </details>

### 20. 在 TypeScript 中，如何处理第三方 JavaScript 库的类型定义？

<details>
<summary>展开答案</summary>

- **查找官方类型定义**：很多流行的第三方库都有官方的类型定义文件，可以通过 `npm` 安装，如 `@types/react`。
- **自定义类型定义文件**：如果没有官方的类型定义文件，可以自己创建 `.d.ts` 文件来定义类型。

```typescript
// myLibrary.d.ts
declare function myLibraryFunction(): void;
declare module 'xxx';
```

- **使用 `any` 类型**：如果实在无法获取类型定义，可以使用 `any` 类型绕过类型检查，但不推荐。

</details>

### 21. 请说明`const`类型断言的作用，以及它和普通类型断言的区别，给出使用示例

<details>
<summary>展开答案</summary>

- **作用**：`const` 类型断言用于将对象字面量的属性推断为更具体的类型，通常会将字符串字面量类型、数字字面量类型等固定下来，而不是推断为更宽泛的类型。
- **与普通类型断言的区别**：普通类型断言只是告诉编译器某个变量的具体类型，不会改变类型推断的结果；而 `const` 类型断言会影响类型推断，让推断结果更精确。
- **示例**：

```typescript
// 普通对象字面量
let obj1 = { a: 1, b: 'hello' };
// obj1.a 的类型是 number，obj1.b 的类型是 string

// 使用 const 类型断言
let obj2 = { a: 1, b: 'hello' } as const;
// obj2.a 的类型是 1，obj2.b 的类型是 "hello"
```

</details>

### 22. 讲述`infer`关键字在条件类型里的用途，结合实例说明其使用方法

<details>
<summary>展开答案</summary>

- **用途**：`infer` 关键字用于在条件类型中推断类型。它可以在条件类型的 `true` 分支中声明一个待推断的类型变量，编译器会根据实际情况推断出这个类型变量的值。
- **示例**：

```typescript
// 定义一个条件类型，用于提取函数的返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 定义一个函数
function add(a: number, b: number): number {
    return a + b;
}

// 使用 ReturnType 类型
type AddReturnType = ReturnType<typeof add>; // number

// 自己写一个includes，infer提取数组里的值
type myIncludes<T, K> = T extends (infer U)[]
    ? K extends U
        ? true
        : false
    : false;

// 使用 infer 提取函数参数类型
type ParametersType<T> = T extends (...args: infer P) => any ? P : never;

// 提取数组里的第一个类型
type FirstElement<T> = T extends [infer First, ...any[]] ? First : never;
```

</details>

### 23. 阐述`Omit<T, K>`工具类型的功能，以及它和`Pick<T, K>`工具类型有何不同，给出使用示例

<details>
<summary>展开答案</summary>

- **功能**：`Omit<T, K>` 工具类型用于从类型 `T` 中移除指定的属性 `K`，创建一个新的类型。
- **与 `Pick<T, K>` 的不同**：`Pick<T, K>` 是从类型 `T` 中选取指定的属性 `K` 组成新类型，而 `Omit<T, K>` 是移除指定的属性 `K` 组成新类型。
- **示例**：

```typescript
interface Person {
    name: string;
    age: number;
    address: string;
}

// 使用 Pick 选取属性
type NameAndAge = Pick<Person, 'name' | 'age'>;

// 使用 Omit 移除属性
type WithoutAddress = Omit<Person, 'address'>;

// 自己实现一个omit
type MyOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};
```

</details>

### 24. 在 TypeScript 中，`namespace`和`module`的概念和区别是什么，它们的使用场景有哪些？

<details>
<summary>展开答案</summary>

- **概念**：
  - **namespace**：在早期的 TypeScript 中，`namespace` 用于组织代码，避免全局命名冲突。它可以包含类、接口、函数等。
  - **module**：ES6 引入了模块系统，TypeScript 也支持这种模块系统。模块是一个独立的文件，通过 `import` 和 `export` 关键字来管理代码的导入和导出。
- **区别**：
  - **语法**：`namespace` 使用 `namespace` 关键字定义，`module` 使用 `import` 和 `export` 关键字。
  - **作用域**：`namespace` 是全局作用域内的命名空间，`module` 是文件级别的作用域。
- **使用场景**：
  - **namespace**：在旧项目或需要在全局作用域内组织代码时使用。
  - **module**：在新项目中，推荐使用 ES6 模块系统来组织代码。

</details>

### 25. 在 TypeScript 中，`declare`作用是什么，declare namespace 和 declare module 和 declare global 有什么区别？

<details>

<summary>展开答案</summary>
    在 TypeScript 中，declare 是一个关键字，用于声明变量、类型、模块或命名空间的存在，主要就是外部的，全局的，或者本来就存在的，但是代码是无法感知推断的时候，就需要用declare声明了。

    -   **declare namespace**：用于声明命名空间或模块。
    -   **declare module**：用于声明模块或第三方库。
    -   **declare global**：用于声明全局变量或类型。
    -   **declare const**：用于声明常量。

```typescript
declare global {
    interface Window {
        a: number;
    }
}
// 使用
window.myLibrary.doSomething();

declare const _globalInitialData: {
    url: string;
    business_data: any;
    component: string;
};
// 使用
console.log(_globalInitialData);
```

</details>
### 26. 对于 TypeScript 的类型兼容性，能详细解释一下结构类型系统的含义吗？请结合实例说明

<details>
<summary>展开答案</summary>

- **结构类型系统含义**：TypeScript 采用结构类型系统，也称为鸭子类型系统。在结构类型系统中，只要两个类型的结构（属性和方法）兼容，就认为它们是兼容的，而不考虑类型的名称。
- **示例**：

```typescript
interface Point {
    x: number;
    y: number;
}

class PointClass {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

let p1: Point = { x: 1, y: 2 };
let p2: PointClass = new PointClass(1, 2);

let p3: Point = p2; // 类型兼容，因为结构相同
```

</details>

### 27. 怎样使用`typeof`操作符在 TypeScript 里获取变量的类型？给出具体例子

<details>
<summary>展开答案</summary>

- **使用方法**：`typeof` 操作符在 TypeScript 中可以用于获取变量的类型。它可以用于基本类型、对象类型、函数类型等。
- **示例**：

```typescript
let num = 10;
type NumType = typeof num; // number

let person = { name: 'John', age: 30 };
type PersonType = typeof person; // { name: string; age: number; }

function add(a: number, b: number) {
    return a + b;
}
type AddFunctionType = typeof add; // (a: number, b: number) => number
```

</details>

### 28. enum 和 const enum 的比较

<details>
<summary>展开答案</summary>

- **编译结果**：
  - **enum**：编译后会生成一个对象，包含枚举成员的映射。例如：

```typescript
enum Color {
    Red,
    Green,
    Blue
}
```

编译后的 JavaScript 代码如下：

```javascript
var Color;
(function (Color) {
    Color[(Color['Red'] = 0)] = 'Red';
    Color[(Color['Green'] = 1)] = 'Green';
    Color[(Color['Blue'] = 2)] = 'Blue';
})(Color || (Color = {}));
```

- **const enum**：编译时会直接将枚举成员替换为其值，不会生成额外的对象。例如：

```typescript
const enum Color {
    Red,
    Green,
    Blue
}

let c = Color.Red;
```

编译后的 JavaScript 代码如下：

```javascript
let c = 0;
```

- **使用场景**：
  - **enum**：当需要在运行时访问枚举对象，或者需要枚举成员的反向映射（通过值获取名称）时使用。
  - **const enum**：当只需要枚举成员的值，并且希望减少编译后的代码体积时使用。需要注意的是，`const enum` 只能使用常量枚举表达式，不能使用计算值。

</details>
