在 TypeScript 中，`typeof` 和 `keyof` 是两个核心的类型操作符，它们在编译时工作，用于提取和处理类型信息。理解它们的实现原理，需要结合 TypeScript 的类型系统设计和编译时类型分析逻辑。

### 一、`typeof`：从值到类型的“反向映射”

`typeof` 是一个**类型查询操作符**，作用是**从“值”（变量、属性、函数等）中提取其类型**，生成对应的 TypeScript 类型。它的核心能力是“将运行时的值的类型信息，映射为编译时的类型”。

#### 1. 基础用法

`typeof` 可以作用于变量、函数、对象属性等“值”，返回其静态类型：

```typescript
// 变量
const num = 42;
type NumType = typeof num; // 类型：number

// 函数
function add(a: number, b: number) {
  return a + b;
}
type AddType = typeof add; // 类型：(a: number, b: number) => number

// 对象
const user = { name: 'Alice', age: 30 };
type UserType = typeof user; // 类型：{ name: string; age: number }
```

#### 2. 实现原理

`typeof` 的工作依赖于 TypeScript 编译器的**类型推断系统**：

- **编译时分析**：当代码被编译时，TypeScript 会先对所有“值”进行静态分析，推断出它们的类型（例如，`const num = 42` 会被推断为 `number` 类型，`const user = { name: "Alice" }` 会被推断为 `{ name: string }`）。
- **类型提取**：`typeof x` 本质上是“查询”编译器已经推断出的 `x` 的类型，并将其作为一个新的类型返回。

简单说，`typeof` 是编译器提供的“类型查询接口”——它不参与值的运算，只在编译阶段读取编译器内部维护的“值-类型”映射表，提取目标值的类型。

#### 3. 特殊场景处理

- **对对象字面量**：`typeof` 会提取完整的结构类型（包括属性名和属性类型），且默认是“可变”类型（属性可修改）。若结合 `as const`，则会提取只读的字面量类型：
  ```typescript
  const config = { mode: 'dev' } as const;
  type ConfigType = typeof config; // 类型：{ readonly mode: "dev" }
  ```
- **对函数**：`typeof` 会提取函数的完整签名（参数类型、返回值类型），包括重载：

  ```typescript
  function fn(a: number): number;
  function fn(a: string): string;
  function fn(a: any): any {
    return a;
  }

  type FnType = typeof fn;
  // 类型：{
  //   (a: number): number;
  //   (a: string): string;
  // }
  ```

- **对数组**：`typeof` 会提取数组的元素类型和结构（普通数组或只读数组）：

  ```typescript
  const arr = [1, 2, 3];
  type ArrType = typeof arr; // 类型：number[]

  const roArr = [1, 2, 3] as const;
  type RoArrType = typeof roArr; // 类型：readonly [1, 2, 3]
  ```

### 二、`keyof`：提取类型的“键集合”

`keyof` 是一个**键提取操作符**，作用是**从“类型”中提取所有公开属性的键，组成一个联合类型**。它的核心能力是“将类型的结构信息，转换为键的集合类型”。

#### 1. 基础用法

`keyof` 通常作用于接口、对象类型、类等“结构化类型”，返回其所有键的联合：

```typescript
// 接口
interface User {
  name: string;
  age: number;
}
type UserKeys = keyof User; // 类型："name" | "age"

// 类型别名
type Point = { x: number; y: number };
type PointKeys = keyof Point; // 类型："x" | "y"

// 类
class Car {
  brand: string;
  price: number;
  constructor(brand: string, price: number) {
    this.brand = brand;
    this.price = price;
  }
}
type CarKeys = keyof Car; // 类型："brand" | "price"
```

#### 2. 实现原理

`keyof` 的工作依赖于 TypeScript 对“结构化类型”的元数据解析：

- **类型元数据**：TypeScript 在编译时会为每个结构化类型（接口、对象类型等）维护一份元数据，包含其所有属性的键名和对应的值类型。
- **键集合提取**：`keyof T` 会遍历类型 `T` 的元数据，收集所有公开属性的键名，将这些键名作为字面量类型，最终组成一个联合类型。

简单说，`keyof` 是编译器提供的“类型键查询接口”——它直接读取类型的元数据，将键名提取为联合类型。

#### 3. 特殊场景处理

- **对基本类型**：`keyof` 会提取基本类型的所有内置属性键（由 JavaScript 原型链定义）：

  ```typescript
  type NumberKeys = keyof number;
  // 类型："toString" | "toFixed" | "toPrecision" | ...（所有 number 原型方法）

  type StringKeys = keyof string;
  // 类型："length" | "charAt" | "substring" | ...（所有 string 原型属性/方法）
  ```

- **对联合类型**：`keyof` 会提取联合类型中**所有类型共有的键**（交集）：

  ```typescript
  type A = { a: number; x: string };
  type B = { b: boolean; x: number };
  type C = A | B;

  type CKeys = keyof C; // 类型："x"（只有 "x" 是 A 和 B 共有的键）
  ```

- **对映射类型/工具类型**：`keyof` 会穿透工具类型，提取最终结构的键：
  ```typescript
  type ReadonlyUser = Readonly<User>; // { readonly name: string; readonly age: number }
  type ReadonlyUserKeys = keyof ReadonlyUser; // 类型："name" | "age"（与原类型键相同）
  ```

### 三、`typeof` 与 `keyof` 的协同作用

`typeof` 和 `keyof` 经常结合使用，实现“从值到键集合”的完整链路：先通过 `typeof` 从值提取类型，再通过 `keyof` 从类型提取键：

```typescript
// 1. 定义一个对象值
const config = {
  host: 'localhost',
  port: 3000,
  https: false,
};

// 2. 用 typeof 提取对象的类型
type Config = typeof config; // { host: string; port: number; https: boolean }

// 3. 用 keyof 提取类型的键集合
type ConfigKeys = keyof Config; // "host" | "port" | "https"
```

这种组合在处理“动态键”场景（如配置项、映射表）时非常有用，能让类型自动跟随值的结构变化，减少手动维护类型的成本。

### 总结

- **`typeof`**：编译时从“值”中提取其类型，依赖 TypeScript 的类型推断系统，本质是“值→类型”的映射。
- **`keyof`**：编译时从“类型”中提取所有键的联合类型，依赖类型的元数据解析，本质是“类型→键集合”的提取。

两者均为 TypeScript 类型系统的基础操作符，通过它们可以实现类型的动态提取和复用，是构建灵活、安全的类型逻辑的核心工具。
