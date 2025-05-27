在JavaScript中，`String.prototype.replace()` 是一个强大的字符串处理方法，可用于替换匹配的子串。它支持多种替换模式（字符串或正则表达式）和灵活的替换逻辑（字符串或回调函数）。以下从基础到高级的全面解析：

### 一、基础语法

#### 1. **替换固定字符串**

```javascript
const str = 'Hello world';
const newStr = str.replace('world', 'JavaScript');
console.log(newStr); // "Hello JavaScript"
```

- **特性**：
  - 仅替换**第一个匹配项**（即使有多个相同子串）。
  - 区分大小写。

#### 2. **使用正则表达式替换**

```javascript
const str = 'Hello world, world';
const newStr = str.replace(/world/g, 'JavaScript');
console.log(newStr); // "Hello JavaScript, JavaScript"
```

- **关键标志**：
  - `g`：全局匹配，替换所有匹配项。
  - `i`：忽略大小写。

### 二、正则表达式的高级应用

#### 1. **捕获组与替换模板**

```javascript
const str = 'John Smith';
const newStr = str.replace(/(\w+) (\w+)/, '$2, $1');
console.log(newStr); // "Smith, John"
```

- **替换模板中的特殊变量**：
  - `$1`, `$2`, ...：对应第1、2个捕获组的内容。
  - `$&`：整个匹配的字符串。
  - `$$`：插入一个美元符号 `$`。

### 三、使用回调函数进行复杂替换

#### 1. **回调函数的参数**

```javascript
const str = 'Hello {name}, your age is {age}.';
const data = { name: 'Max', age: 12 };

const newStr = str.replace(/\{([^{}]+)\}/g, (match, key, index, original) => {
  // match: 整个匹配的字符串（如 "{name}"）
  // key: 第一个捕获组的内容（如 "name"）
  // index: 匹配的起始位置
  // original: 原始字符串
  return data[key] || match;
});

console.log(newStr); // "Hello Max, your age is 12."
```

#### 2. **动态替换示例**

```javascript
// 将数字转换为对应的中文大写
const str = 'Price: 1234';
const newStr = str.replace(/\d/g, (num) => {
  const map = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  return map[parseInt(num)];
});

console.log(newStr); // "Price: 壹贰叁肆"
```

### 四、特殊场景处理

#### 1. **替换所有匹配项（字符串版）**

```javascript
// 字符串替换默认只替换第一个匹配
const str = 'apple, apple';
const newStr = str.replace(/apple/g, 'banana'); // 正确方式
// 或使用 replaceAll（ES2021+）
const newStr2 = str.replaceAll('apple', 'banana');
```

#### 2. **处理大小写不敏感**

```javascript
const str = 'Hello World';
const newStr = str.replace(/world/i, 'JavaScript');
console.log(newStr); // "Hello JavaScript"
```

#### 3. **替换HTML特殊字符**

```javascript
const html = "<script>alert('XSS');</script>";
const escaped = html.replace(/[<>"&]/g, (char) => {
  const entities = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '&': '&amp;',
  };
  return entities[char] || char;
});

console.log(escaped); // "&lt;script&gt;alert('XSS');&lt;/script&gt;"
```

### 五、性能考量

#### 1. **正则表达式编译开销**

- **避免重复编译**：

  ```javascript
  // 低效：每次调用都编译正则
  function replaceAll(str) {
    return str.replace(/apple/g, 'banana');
  }

  // 高效：预编译正则
  const regex = /apple/g;
  function replaceAll(str) {
    return str.replace(regex, 'banana');
  }
  ```

#### 2. **大量替换时的性能对比**

```javascript
// 场景：将所有空格替换为下划线
const str = 'a '.repeat(10000);

// 方法1：正则替换（快）
console.time('regex');
str.replace(/ /g, '_');
console.timeEnd('regex'); // ~0.5ms

// 方法2：循环+split+join（慢）
console.time('loop');
str.split(' ').join('_');
console.timeEnd('loop'); // ~2ms
```

### 六、常见陷阱与最佳实践

#### 1. **忘记全局标志（`g`）**

```javascript
const str = 'hello world';
str.replace(/o/, 'O'); // "hellO world"（仅替换第一个）
str.replace(/o/g, 'O'); // "hellO wOrld"（替换所有）
```

#### 2. **捕获组的括号嵌套**

```javascript
const str = '123-456';
// 错误：多余的括号导致捕获组错位
str.replace(/(\d+)-((\d+))/, '$2-$1'); // "456-123"（正确但冗余）
// 正确：简化括号
str.replace(/(\d+)-(\d+)/, '$2-$1'); // "456-123"
```

#### 3. **回调函数中的异步操作**

```javascript
// 错误示例：replace 不支持异步回调
async function replaceAsync() {
  const str = 'a,b';
  return str.replace(/\w/g, async (char) => {
    const data = await fetchData(char); // 异步操作
    return data;
  });
}

// 正确方式：手动处理
async function replaceAsync() {
  const str = 'a,b';
  const matches = [...str.matchAll(/\w/g)];
  const replacements = await Promise.all(matches.map(async (m) => await fetchData(m[0])));
  return str.replace(/\w/g, (_, i) => replacements[i]);
}
```

### 七、总结：何时使用什么方法？

| 场景                   | 推荐方法                                         |
| ---------------------- | ------------------------------------------------ |
| 替换固定字符串（单次） | `str.replace("old", "new")`                      |
| 替换固定字符串（全局） | `str.replaceAll("old", "new")`                   |
| 替换动态模式           | `str.replace(/regex/g, "new")`                   |
| 复杂替换逻辑           | `str.replace(/regex/g, (match) => { ... })`      |
| 保留原始大小写         | `str.replace(/regex/gi, (m) => m.toUpperCase())` |
| 高性能批量替换         | 预编译正则 + `replace`                           |

掌握 `replace` 的这些用法，能让你在处理字符串时更加游刃有余。
