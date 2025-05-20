### **一、基本返回结构**

#### 1. **无全局标志 `g`**

- **返回值**：数组（或 `null`，若未匹配到）。
- **数组内容**：
  - `match[0]`：完整匹配的子串。
  - `match[1]`, `match[2]`, ...：捕获组的内容（按括号顺序）。
  - `index`：匹配开始的位置。
  - `input`：原始输入的字符串。
  - `groups`：命名捕获组的对象（若有）。

#### **示例**：

```javascript
const str = "Hello, world!";
const match = str.match(/(\w+), (\w+)/);

console.log(match);
// 输出:
[
  "Hello, world",  // match[0]: 完整匹配
  "Hello",         // match[1]: 第一个捕获组 (\w+)
  "world",         // match[2]: 第二个捕获组 (\w+)
  index: 0,         // 匹配开始的位置
  input: "Hello, world!",  // 原始字符串
  groups: undefined  // 无命名捕获组
]
```

#### 2. **有全局标志 `g`**

- **返回值**：仅包含完整匹配的数组（或 `null`）。
- **特性**：
  - **忽略捕获组**：结果中不包含捕获组的内容。
  - **无其他属性**：不包含 `index`、`input` 等信息。

#### **示例**：

```javascript
const str = 'Hello, world! Hello, universe!';
const match = str.match(/(\w+), (\w+)/g);

console.log(match);
// 输出:
[
  'Hello, world', // 仅完整匹配，忽略捕获组
  'Hello, universe',
];
```

### **二、捕获组的影响**

#### 1. **普通捕获组 `(...)`**

- **示例**：

  ```javascript
  const str = "2023-05-16";
  const match = str.match(/(\d{4})-(\d{2})-(\d{2})/);

  console.log(match);
  // 输出:
  [
    "2023-05-16",  // 完整匹配
    "2023",         // 第一个捕获组 (\d{4})
    "05",           // 第二个捕获组 (\d{2})
    "16",           // 第三个捕获组 (\d{2})
    index: 0,
    input: "2023-05-16"
  ]
  ```

#### 2. **命名捕获组 `(?<name>...)`**

- **ES2018+ 支持**：通过 `groups` 属性访问。
- **示例**：

  ```javascript
  const str = "2023-05-16";
  const match = str.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);

  console.log(match.groups);
  // 输出:
  {
    year: "2023",
    month: "05",
    day: "16"
  }
  ```

### **三、边界情况**

#### 1. **无匹配结果**

- **返回 `null`**：
  ```javascript
  const match = 'abc'.match(/xyz/);
  console.log(match); // null
  ```

#### 2. **空捕获组**

- **示例**：

  ```javascript
  const match = 'a,b,c'.match(/a(,)?b(,)?c/);

  console.log(match);
  // 输出:
  [
    'a,b,c', // 完整匹配
    ',', // 第一个捕获组 (,)? 匹配到逗号
    undefined, // 第二个捕获组 (,)? 未匹配到内容
  ];
  ```

### **四、与 `exec()` 的对比**

| **方法**        | **全局标志 `g` 的行为**                      | **捕获组处理**      | **迭代匹配**             |
| --------------- | -------------------------------------------- | ------------------- | ------------------------ |
| `match()`       | 返回所有完整匹配（忽略捕获组）               | 无 `g` 时包含捕获组 | 不支持                   |
| `RegExp.exec()` | 每次调用返回一个匹配（含捕获组），需循环调用 | 始终包含捕获组      | 支持（通过 `lastIndex`） |

#### **示例**：使用 `exec()` 迭代全局匹配

```javascript
const str = 'Hello, world! Hello, universe!';
const regex = /(\w+), (\w+)/g;

let match;
while ((match = regex.exec(str)) !== null) {
  console.log(`匹配位置: ${match.index}`);
  console.log(`完整匹配: ${match[0]}`);
  console.log(`第一个捕获组: ${match[1]}`);
  console.log(`第二个捕获组: ${match[2]}`);
}
```

### **五、总结：如何理解 `match` 返回值？**

1. **无 `g` 标志**：

   - 返回完整匹配和所有捕获组。
   - 适用于需要提取子串的场景（如解析日期、URL）。

2. **有 `g` 标志**：

   - 仅返回完整匹配的数组。
   - 适用于快速查找所有匹配（如统计关键词出现次数）。

3. **命名捕获组**：
   - 通过 `groups` 对象访问，提高代码可读性。
   - 示例：`match.groups.year` 比 `match[1]` 更直观。
