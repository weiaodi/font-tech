CommonJS 的缓存机制确实容易让人混淆。关键点在于：**模块只执行一次（缓存实例），但导出的值是静态拷贝（而非动态引用）**。以下是详细解释：

### **一、核心机制图解**

```
1. 首次加载模块：
   ┌───────────────────────────────┐
   │  执行模块代码                 │
   │  ┌─────────────────────────┐  │
   │  │  module.exports =       │  │
   │  │    value: 0,            │  │  <── 导出时拷贝值（0）
   │  │    increment: function  │  │
   │  └─────────────────────────┘  │
   └───────────────────┬──────────┘
                       │
                       ▼
2. 缓存模块实例（module.exports 对象）
3. 后续导入：
   ┌───────────────────┐
   │  返回缓存的 exports │
   │  ┌───────────────┐ │
   │  │  value: 0     │ │  <── 始终返回初始拷贝值
   │  │  increment    │ │
   │  └───────────────┘ │
   └───────────────────┘
```

### **二、示例代码演示**

#### **1. 模块定义**

```javascript
// counter.js (CommonJS)
let count = 0;

function increment() {
  count++;
  console.log('内部 count:', count);
}

// 导出时拷贝 count 的初始值（0）
module.exports = {
  count, // 拷贝值（0）
  increment, // 导出函数引用
  getCount() {
    // 通过方法获取实时值
    return count;
  },
};
```

#### **2. 主模块导入**

```javascript
// main.js (CommonJS)
const counter = require('./counter');

console.log('初始 count:', counter.count); // 0
counter.increment(); // 内部 count: 1
console.log('拷贝的 count:', counter.count); // 0（拷贝的值不会更新）
console.log('实时 count:', counter.getCount()); // 1（通过方法获取实时值）
```

### **三、缓存机制的关键点**

1. **模块只执行一次**：

   - 首次导入时执行模块代码，生成 `module.exports` 对象
   - 后续导入直接返回缓存的 `module.exports`，不重新执行代码

2. **值的拷贝发生在导出时刻**：

   - 导出 `count` 时，实际导出的是 `0`（而非对 `count` 变量的引用）
   - 即使原变量被修改，导出的拷贝值不会变化

3. **函数导出的是引用**：
   - `increment` 函数导出的是函数引用
   - 调用该函数会修改原模块内部的 `count` 变量

### **四、对比 ES6 模块的行为**

#### **ES6 模块（值的引用）**

```javascript
// counter.js (ES6)
export let count = 0;

export function increment() {
  count++;
}
```

```javascript
// main.js (ES6)
import { count, increment } from './counter';

console.log(count); // 0
increment();
console.log(count); // 1（引用的值实时更新）
```

### **五、常见误解澄清**

1. **误解：缓存机制导致值被冻结**

   - **真相**：缓存的是 `module.exports` 对象，但导出的值是拷贝
   - 修改原模块内部变量不会影响已导出的拷贝值

2. **如何获取实时值？**

   - 导出方法而非原始值：
     ```javascript
     // counter.js
     let count = 0;
     module.exports = {
       getCount() {
         return count;
       }, // 返回实时值
     };
     ```

3. **对象属性的特殊情况**：

   - 如果导出的是对象，修改对象属性会反映在所有导入处（因为对象是引用类型）

     ```javascript
     // state.js
     const state = { count: 0 };
     module.exports = { state }; // 导出对象引用

     // main.js
     const { state } = require('./state');
     state.count++; // 修改属性会影响所有引用
     ```

### **六、验证测试**

创建以下文件并运行，观察结果：

```javascript
// cache-test.js
const mod1 = require('./module');
const mod2 = require('./module');

console.log('mod1 === mod2:', mod1 === mod2); // true（同一实例）
console.log('mod1.value:', mod1.value); // 0
console.log('mod2.value:', mod2.value); // 0

mod1.increment();
console.log('mod1.value:', mod1.value); // 0（拷贝值不变）
console.log('mod2.value:', mod2.value); // 0

console.log('mod1.getValue():', mod1.getValue()); // 1（实时值）
```

```javascript
// module.js
let value = 0;

function increment() {
  value++;
}

module.exports = {
  value, // 导出时拷贝 0
  increment,
  getValue() {
    // 返回实时值
    return value;
  },
};
```

### **七、总结**

CommonJS 的缓存机制可以概括为：

- **模块实例唯一**：无论导入多少次，返回的都是同一个 `module.exports` 对象
- **值的静态拷贝**：导出的原始值（如数字、字符串）是导出时刻的快照，后续修改不影响已导出的值
- **函数/对象引用**：导出函数或对象时，传递的是引用，修改其内部状态会影响所有导入处

理解这一机制有助于避免在 Node.js 开发中因值拷贝导致的意外行为。CommonJS 的缓存机制确实容易让人混淆。关键点在于：**模块只执行一次（缓存实例），但导出的值是静态拷贝（而非动态引用）**。以下是详细解释：
