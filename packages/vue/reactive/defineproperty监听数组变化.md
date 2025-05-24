### Object.defineProperty 监控数组下标的实现与 Vue 的取舍分析

#### 核心代码示例

```js
function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function defineGet() {
      console.log(`get key: ${key} value: ${value}`);
      return value;
    },
    set: function defineSet(newVal) {
      console.log(`set key: ${key} value: ${newVal}`);
      value = newVal;
    },
  });
}

function observe(data) {
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
}

let arr = [1, 2, 3];
observe(arr); // 仅监控初始索引 0、1、2
```

#### 数组操作的响应式表现

1. **通过下标访问/修改元素**

   ```js
   arr[0]; // 触发 getter
   arr[0] = 100; // 触发 setter
   ```

   - **结论**：对已监控的下标（如 `0`、`1`、`2`）有效。

2. **`push()` 方法**

   ```js
   arr.push(4); // 新增索引 3，**不触发 getter/setter**
   ```

   - **原因**：新增下标未经过 `observe()` 初始化，类似对象新增属性。

3. **`unshift()` 方法**

   ```js
   arr.unshift(0); // 触发原索引 0、1、2 的 getter 和 setter
   ```

   - **过程**：
     1. 取出原元素（触发 `getter`） → 2. 重新赋值到新索引（触发 `setter`）。
   - **性能代价**：需遍历所有元素，复杂度 **O(n)**。

4. **`pop()` 方法**
   ```js
   arr.pop(); // 触发最后一个元素的 `getter`
   ```
   - **结果**：删除元素后，该下标不再被监控。

#### Vue2.x 放弃完全监控数组的原因

1. **性能瓶颈**：

   - 数组扩容时需重新遍历所有元素进行劫持，大数据量场景下卡顿明显。
   - 例如：`arr.push(1000)` 需新增 1000 个下标监控，消耗大量内存和计算资源。

2. **替代方案**：

   - 拦截数组原生方法（如 `push`、`splice`）实现响应式，避免递归劫持。
   - 提供 `Vue.set` 手动处理新增属性，例如：
     ```js
     Vue.set(arr, index, value); // 触发响应式更新
     ```

3. **Vue3 的改进**：
   - 使用 `Proxy` 替代 `Object.defineProperty`，直接劫持整个数组，无需手动处理下标变化。

#### 实践建议

- **避免直接通过下标修改数组**：改用 `Vue.set` 或数组原生方法（如 `splice`）。
- **大数据场景**：优先使用 Vue3 或 `immer` 等状态管理库，提升响应式性能。
