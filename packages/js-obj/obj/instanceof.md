### **1. `instanceof` 运算符的工作原理**

`instanceof` 用于检查一个对象是否是某个构造函数的实例。它通过检查对象的原型链（`[[Prototype]]`）是否包含构造函数的 `prototype` 属性来判断：

```javascript
object instanceof Constructor;
// 等价于
Constructor.prototype.isPrototypeOf(object);
```

### **2. 原始值（Primitive）与对象（Object）的区别**

JavaScript 中的 `Number` 既可以作为 **原始值类型**，也可以作为 **构造函数**：

- **原始值**：直接使用 `123`、`3.14` 等字面量创建的数值。
- **对象**：使用 `new Number(123)` 创建的包装对象。

**关键区别**：

- 原始值不是对象，没有原型链，因此无法通过 `instanceof` 检查。
- 包装对象是对象，有原型链，可以通过 `instanceof` 检查。

### **3. 分析 `Number instanceof Number`**

#### **情况 1：`Number` 作为构造函数**

```javascript
const numObj = new Number(123);
console.log(numObj instanceof Number); // true
```

这里 `numObj` 是通过 `Number` 构造函数创建的对象，其原型链包含 `Number.prototype`，因此结果为 `true`。

#### **情况 2：`Number` 作为全局构造函数本身**

```javascript
console.log(Number instanceof Number); // false
```

- `Number` 是一个内置的构造函数（属于函数对象），它的原型链是：
  ```
  Number → Function.prototype → Object.prototype → null
  ```
- 由于 `Number.prototype` 不在 `Number` 自身的原型链中，因此结果为 `false`。

### **4. 类似的例子**

以下表达式的结果都是 `false`，原因相同：

```javascript
String instanceof String; // false
Boolean instanceof Boolean; // false
Function instanceof Function; // false（虽然 Function 是自身的构造函数，但原型链不包含自身的 prototype）
Object instanceof Object; // false
```

### **总结**

- **`Number instanceof Number` 为 `false`**，因为 `Number` 构造函数的原型链中不包含 `Number.prototype`。
- **原始值（如 `123`）无法通过 `instanceof` 检查**，因为它们不是对象。
- **只有通过 `new Number()` 创建的对象才是 `Number` 的实例**。

若需判断一个值是否为数值类型，建议使用 `typeof` 或 `Number.isFinite()`：

```javascript
typeof 123 === 'number'; // true
typeof new Number(123) === 'object'; // true（注意包装对象是对象类型）
Number.isFinite(123); // true
```
