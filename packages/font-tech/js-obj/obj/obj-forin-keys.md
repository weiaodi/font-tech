在 JavaScript 中，`for...in` 循环的设计初衷是**遍历对象及其原型链上的** **可枚举属性**（包括继承的属性）。这是由 `for...in` 的特性决定的，与属性的 `configurable` 描述符无关，核心原因在于以下两点：

### **一、`for...in` 的遍历范围：原型链上的可枚举属性**

#### 1. **自身属性与继承属性**

- **自身属性**：直接定义在对象实例上的属性（如 `obj.a = 1`）。
- **继承属性**：从对象的原型链（`__proto__`）上继承的属性（如 `obj.toString` 继承自 `Object.prototype`）。

`for...in` 会**递归遍历原型链上的所有可枚举属性**，无论该属性是自身定义的还是继承的。

#### 2. **可枚举性（`enumerable` 描述符）的作用**

- 只有`enumerable: true` 的属性会被 `for...in` 遍历到，无论该属性是自身属性还是继承属性。
- 原型链上的默认属性（如 `Object.prototype` 上的方法）通常**不可枚举**（`enumerable: false`），因此不会被 `for...in` 遍历到。但如果显式将继承属性的 `enumerable` 设为 `true`，则会被遍历。

### **二、为什么原型链上的属性会被遍历？示例解析**

#### 场景 1：继承原型链上的**可枚举属性**

```javascript
// 定义原型对象
const proto = {
  protoProp: '原型属性',
  // 显式设置为可枚举（默认对象字面量定义的属性 enumerable: true）
};

// 创建实例并关联原型
const obj = Object.create(proto);
obj.ownProp = '自身属性'; // 自身属性

// 遍历 obj
for (const key in obj) {
  console.log(key); // 输出：'ownProp'（自身属性）、'protoProp'（原型属性）
}
```

- **原因**：  
  原型 `proto` 上的 `protoProp` 的 `enumerable: true`，因此会被 `for...in` 遍历到。

#### 场景 2：原型链上的**不可枚举属性**（默认情况）

```javascript
const obj = {}; // 继承自 Object.prototype

// Object.prototype 的 toString 方法默认 enumerable: false
for (const key in obj) {
  console.log(key); // 输出：无（toString 不可枚举）
}
```

- **原因**：  
  `Object.prototype` 上的方法（如 `toString`、`hasOwnProperty`）默认 `enumerable: false`，因此不会被 `for...in` 遍历到。

### **三、如何避免遍历继承属性？**

若需要**仅遍历自身属性**，需手动过滤掉原型链上的属性，常用方法：

#### 1. **`hasOwnProperty` 方法**

```javascript
const obj = Object.create({ protoProp: '原型属性' });
obj.ownProp = '自身属性';

for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    // 过滤掉继承属性
    console.log(key); // 仅输出 'ownProp'
  }
}
```

- `hasOwnProperty` 会检测属性是否为对象**自身属性**（非继承自原型链）。

#### 2. **`Object.keys()` 或 `Object.getOwnPropertyNames()`**

- `Object.keys(obj)`：返回**自身可枚举属性**的键数组（不包含继承属性）。
- `Object.getOwnPropertyNames(obj)`：返回**所有自身属性**的键数组（包括不可枚举属性，不包含继承属性）。

在 JavaScript 中，`Object.getOwnPropertyNames(obj)` 是一个用于获取对象**自身属性名称**的方法（无论属性是否可枚举）。以下是其核心特性和示例解析：

### **一、核心特性**

1. **仅返回自身属性**
   - 不包含原型链上的属性（只处理对象实例本身的属性）。
2. **包含不可枚举属性**
   - 与 `Object.keys(obj)` 不同，后者仅返回**可枚举的自身属性**。
3. **不包含 Symbol 类型属性**
   - 若需获取 Symbol 类型的属性，需使用 `Object.getOwnPropertySymbols(obj)`。

### **二、示例解析**

#### **场景 1：基本用法**

```javascript
const obj = {
  a: 1,
  b: 2,
};
Object.defineProperty(obj, 'c', {
  value: 3,
  enumerable: false, // 不可枚举
});

console.log(Object.getOwnPropertyNames(obj)); // ['a', 'b', 'c']
console.log(Object.keys(obj)); // ['a', 'b']（仅可枚举属性）
```
