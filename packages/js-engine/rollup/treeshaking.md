在 Tree Shaking 中，判断代码是否为 **Dead Code**（未使用的代码）主要基于静态分析。以下是 Rollup（以及其他打包工具）识别 Dead Code 的具体方法和判断依据：

### **1. 静态分析原理**

Tree Shaking 依赖 **ES 模块的静态结构**（即导入/导出语句在编译时可知），通过以下步骤识别 Dead Code：

1. **构建依赖图**：分析模块间的导入/导出关系
2. **标记可达代码**：从入口点开始，标记所有被直接或间接引用的代码
3. **移除未标记代码**：未被标记的代码即为 Dead Code

### **2. 判断标准详解**

#### **（1）未导出的代码**

- **规则**：模块内未通过 `export` 暴露的代码，会被视为 Dead Code
- **示例**：
  ```javascript
  // utils.js
  const add = (a, b) => a + b; // ❌ 未导出，会被移除
  export const subtract = (a, b) => a - b; // ✅ 导出，会保留
  ```

#### **（2）未使用的导出**

- **规则**：导出的内容未被其他模块引用，会被移除
- **示例**：

  ```javascript
  // utils.js
  export const add = (a, b) => a + b;
  export const subtract = (a, b) => a - b;

  // main.js
  import { add } from './utils.js'; // subtract 未被使用，会被移除
  ```

#### **（3）纯函数/变量**

- **规则**：无副作用的纯函数/变量，若未被引用则会被移除
- **示例**：

  ```javascript
  // 纯函数：未被引用时会被移除
  export const double = (num) => num * 2; // ❌ 未被使用，会被移除

  // 副作用代码：即使未被引用也会保留
  console.log('初始化...'); // ✅ 模块加载时执行，会保留
  ```

#### **（4）条件语句中的 Dead Code**

- **规则**：静态分析可确定的不可达分支会被移除
- **示例**：

  ```javascript
  // 静态条件：false 分支会被移除
  if (false) {
    console.log('永远不会执行'); // ❌ 会被移除
  }

  // 动态条件：无法静态分析，整个语句会保留
  if (Math.random() > 0.5) {
    console.log('可能执行'); // ✅ 会保留
  }
  ```

#### **（5）间接引用与命名空间导入**

- **规则**：通过命名空间导入（如 `import * as utils`）的模块，所有导出都会被保留
- **示例**：

  ```javascript
  // utils.js
  export const add = (a, b) => a + b;
  export const subtract = (a, b) => a - b;

  // main.js
  import * as utils from './utils.js'; // ✅ add 和 subtract 都会保留
  console.log(utils.add(1, 2));
  ```

### **3. 特殊场景分析**

#### **（1）装饰器（Decorators）**

- **问题**：装饰器可能干扰 Tree Shaking，尤其是包含副作用时
- **示例**：

  ```javascript
  // ❌ 装饰器包含副作用，可能阻止 Tree Shaking
  function log(target) {
    console.log('Applying decorator'); // 副作用
    return target;
  }

  @log
  export class Calculator {} // 即使未被使用，Calculator 可能不会被移除
  ```

#### **（2）动态导入**

- **问题**：`import()` 动态导入的模块无法静态分析，可能保留未使用代码
- **示例**：
  ```javascript
  // ❌ 动态导入的模块无法完全 Tree Shaking
  const loadModule = async () => {
    const module = await import('./utils.js');
    return module.add(1, 2); // utils.js 中的其他导出可能被保留
  };
  ```

#### **（3）第三方库**

- **问题**：CommonJS 模块或未正确声明 `sideEffects` 的库可能影响 Tree Shaking
- **解决方案**：
  ```json
  // package.json
  {
    "sideEffects": false // 声明无副作用
  }
  ```

### **4. 验证方法**

#### **（1）使用 Rollup 的 `--stats` 选项**

生成详细报告，查看哪些代码被保留/移除：

```bash
pnpm rollup -c --stats
```

#### **（2）检查打包输出**

直接查看打包后的代码，确认未使用的代码是否被移除。

#### **（3）使用插件辅助分析**

- **rollup-plugin-visualizer**：生成依赖图可视化报告

  ```javascript
  import { visualizer } from 'rollup-plugin-visualizer';

  export default {
    plugins: [
      visualizer({
        filename: './dist/stats.html',
        open: true,
      }),
    ],
  };
  ```

### **5. 常见误区**

#### **（1）误以为所有未使用代码都会被移除**

- 仅静态分析可确定的 Dead Code 会被移除
- 动态逻辑（如运行时条件）可能保留未使用代码

#### **（2）忽略副作用**

- 未声明的副作用代码（如初始化脚本、CSS 导入）可能被意外移除

#### **（3）错误的模块格式**

- 使用 `format: 'cjs'`（CommonJS）会禁用 Tree Shaking

### **总结**

Tree Shaking 的核心是 **静态分析可达性**：

- **未导出的代码**：直接移除
- **未使用的导出**：若无副作用则移除
- **副作用代码**：需通过 `sideEffects` 声明保留

通过理解这些规则并结合工具验证，可确保 Tree Shaking 正确工作，最大程度减小包体积。
