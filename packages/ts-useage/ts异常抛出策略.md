### **一、异常（Exception）的设计定位**

#### 1. **异常的本质：不可预期的错误**

- 在编程中，**异常应仅用于表示“无法正常处理的错误”**（如网络请求失败、文件读取权限错误），而非“可预见的业务逻辑分支”（如参数校验不通过、数据不存在）。
- TypeScript遵循这一原则，鼓励通过**返回值或Promise状态**处理可复原的场景，而非依赖异常机制。

#### 2. **“可复原异常”的反模式**

```typescript
// 反例：用异常处理可预见的业务逻辑
function getUser(id: number) {
  if (id <= 0) {
    throw new Error('ID必须为正数'); // 可复原的业务错误，不应抛异常
  }
  // ...获取用户逻辑
}
```

上述代码中，`id <= 0`是可预见的参数校验，属于**可复原的业务逻辑**，应通过返回值或类型系统处理，而非抛异常。

### **二、TypeScript中避免可复原异常的核心原因**

#### 1. **类型系统与异常机制的语义冲突**

- TypeScript的类型系统强调“**提前发现错误**”，而异常是运行时机制，两者在设计目标上存在矛盾：
  - 可复原的业务逻辑应通过**联合类型**（如`string | null`）、**可选链**（`?.`）或**防御性编程**处理，让类型系统在编译阶段捕获问题。
  - 抛异常会绕过类型检查，导致错误在运行时暴露（如未处理的`try/catch`块）。

#### 2. **异常处理的性能与可维护性问题**

- 异常捕获（`try/catch`）的性能开销高于条件判断，且会使代码结构变得复杂：
  ```typescript
  // 反例：复杂的异常处理
  try {
    const data = await fetchData();
    return processData(data);
  } catch (e) {
    // 难以区分异常类型，调试困难
    console.error('处理失败', e);
    return null;
  }
  ```
- 可复原的场景应通过**明确的错误返回类型**（如`Result<T, E>`模式）或**Promise的reject**处理，使错误处理逻辑更清晰。

#### 3. **TypeScript的控制流分析限制**

- 异常抛出会打断控制流分析，导致类型收窄失效：
  ```typescript
  function process(input: string | number) {
    if (typeof input === 'string') {
      if (input.length === 0) {
        throw new Error('字符串不能为空'); // 抛异常后，后续代码无法被分析
      }
      return input.toUpperCase();
    }
    // 此处TypeScript无法确定input是number（因异常可能从string分支抛出）
    return input.toFixed(2); // 编译错误：string可能已被抛异常
  }
  ```
- 若用条件返回替代异常，控制流分析可正常工作：
  ```typescript
  function process(input: string | number): string | null {
    if (typeof input === 'string') {
      if (input.length === 0) return null; // 明确返回null，类型系统可分析
      return input.toUpperCase();
    }
    return input.toFixed(2); // 正确：input此时必为number
  }
  ```

### **三、替代方案：TypeScript推荐的错误处理范式**

#### 1. **使用联合类型与可选值**

- 用`null`、`undefined`或特定标记值表示可复原的错误：
  ```typescript
  function divide(a: number, b: number): number | null {
    if (b === 0) return null; // 用null表示“除零错误”，可复原
    return a / b;
  }
  ```
- 配合类型保护函数收窄类型：
  ```typescript
  function isNumberResult(result: number | null): result is number {
    return result !== null;
  }
  ```

#### 2. **Result模式（推荐）**

- 通过泛型封装成功/失败状态，明确区分业务逻辑与错误处理：

  ```typescript
  type Result<T, E> = { success: true; data: T } | { success: false; error: E };

  function fetchUser(id: number): Result<User, string> {
    if (id <= 0) {
      return { success: false, error: 'ID必须为正数' }; // 可复原的业务错误
    }
    // ...成功获取用户
    return { success: true, data: { id, name: '张三' } };
  }

  // 使用时：
  const result = fetchUser(-1);
  if (result.success) {
    console.log(result.data.name);
  } else {
    console.error('错误：', result.error);
  }
  ```

- 优势：类型系统可强制要求处理错误分支，避免遗漏。

#### 3. **Promise的reject与async/await**

- 异步场景中，用`Promise.reject`表示可复原的错误，而非抛异常：
  ```typescript
  async function loadData(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP错误：${response.status}`); // 网络错误属于可复原异常？
        // 更推荐：return Promise.reject(new Error(...))
      }
      return response.json();
    } catch (e) {
      // 处理网络错误，可重试或返回默认值
      return null;
    }
  }
  ```
- 注意：网络错误等I/O异常在TypeScript中通常被视为“可复原”，应通过`catch`处理而非向上抛出。

### **四、例外情况：可抛异常的场景**

尽管推荐避免可复原异常，但以下场景可例外：

1. **不可预见的系统错误**：  
   如内存溢出、文件系统崩溃等，此时程序无法正常复原，应抛异常终止。
2. **框架或库的约定**：  
   若第三方库要求通过异常处理（如某些Node.js回调风格的API），可遵循其规范。
3. **防御性编程中的断言**：  
   使用`assert`函数断言不可达的代码路径（TypeScript 4.7+支持）：
   ```typescript
   function assert(condition: unknown, message: string): asserts condition {
     if (!condition) {
       throw new Error(message); // 断言失败时抛异常，属于不可复原错误
     }
   }
   ```

### **五、总结：TypeScript异常处理的最佳实践**

1. **核心原则**：

   - 异常仅用于表示“**程序无法继续执行的错误**”，如运行时环境错误。
   - 可复原的业务逻辑（如参数校验、数据不存在）应通过**返回值或Promise状态**处理。

2. **类型系统协作**：  
   利用联合类型、泛型和类型保护函数，让TypeScript在编译阶段强制处理错误场景，避免运行时异常。

3. **代码可维护性**：  
   优先使用结构化的错误处理模式（如Result），使错误路径与正常逻辑分离，提升代码可读性。
