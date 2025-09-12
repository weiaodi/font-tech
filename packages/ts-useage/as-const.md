`as const` 是 TypeScript 3.4 引入的一个类型断言特性，主要用于将变量或表达式的类型「收紧」为其字面量类型（literal type），而非更宽泛的基础类型，从而提供更精确的类型约束。

它的核心作用是告诉 TypeScript：**这个值是一个不可变的常量，其类型应该被精确到具体的字面量，而非自动推断为更通用的类型**。

### 具体用法和效果

#### 1. 收紧基本类型的推断

当你定义一个变量时，TypeScript 通常会推断其为基础类型（如 `string`、`number`），而 `as const` 会强制其类型为具体的字面量：

```typescript
// 不使用 as const：类型被推断为 string
const str1 = 'hello'; // 类型：string

// 使用 as const：类型被收紧为 "hello"（字面量类型）
const str2 = 'hello' as const; // 类型："hello"

// 数字同理
const num1 = 42; // 类型：number
const num2 = 42 as const; // 类型：42
```

#### 2. 处理数组和对象的不可变性

对于数组和对象，`as const` 会将其变为「只读」，并将所有元素/属性的类型收紧为字面量：

```typescript
// 普通数组：类型被推断为 string[]
const arr1 = ['a', 'b']; // 类型：string[]

// 使用 as const：变为只读元组，元素类型为字面量
const arr2 = ['a', 'b'] as const; // 类型：readonly ["a", "b"]
// 此时无法修改数组元素（只读），且类型精确到每个位置的具体值

// 普通对象：属性类型被推断为宽泛类型
const obj1 = { name: 'Alice', age: 30 }; // 类型：{ name: string; age: number }

// 使用 as const：属性变为只读，类型收紧为字面量
const obj2 = { name: 'Alice', age: 30 } as const;
// 类型：{ readonly name: "Alice"; readonly age: 30 }
```

#### 3. 用于函数返回值或表达式

`as const` 也可用于函数返回值或复杂表达式，确保类型被精确推断：

```typescript
function getConfig() {
  return {
    mode: 'development',
    port: 3000,
  } as const; // 返回值类型：{ readonly mode: "development"; readonly port: 3000 }
}

// 调用函数时，类型会被精确捕获
const config = getConfig();
// config.mode 的类型是 "development"（而非 string）
// config.port 的类型是 3000（而非 number）
```

### 核心价值

- **更严格的类型约束**：避免因类型宽泛导致的意外赋值（如给 `str2` 赋其他字符串会报错）。
- **精确的类型推导**：在处理枚举、配置项、状态值等场景时，让 TypeScript 更智能地提示和校验。
- **提升代码可读性**：明确告诉开发者和 TypeScript 引擎：「这个值是固定不变的字面量」。

例如，在处理 API 状态时，`as const` 能让类型更精确：

```typescript
const Status = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// 类型："pending" | "success" | "error"
type StatusType = (typeof Status)[keyof typeof Status];
```

总之，`as const` 是 TypeScript 中用于「类型收紧」的重要工具，尤其适合需要精确控制类型的场景，能显著提升类型检查的严格性和代码的可维护性。
