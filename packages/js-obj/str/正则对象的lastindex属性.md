### 一、lastIndex 属性详解

**类型**：`number`  
**含义**：下一次匹配的起始位置（仅对带 `g` 或 `y` 标志的正则有效）。

**特性**：

1. **成功匹配后**：`lastIndex` 会被更新为匹配结束的位置。
2. **匹配失败时**：`lastIndex` 会被重置为 `0`。

**示例**：

```javascript
const regex = /a/g;
const str = 'abc';

console.log(regex.lastIndex); // 0
regex.exec(str); // ['a']（匹配成功）
console.log(regex.lastIndex); // 1（匹配结束位置）

regex.exec(str); // null（从位置1开始匹配失败）
console.log(regex.lastIndex); // 0（匹配失败后重置）
```

### 二、与 lastIndex 相关的陷阱

#### 1. **全局标志 `g` 的影响**

```javascript
const regex = /a/g;

// 使用 match 方法（自动处理所有匹配）
'abca'.match(regex); // ['a', 'a']（正确返回所有匹配）

// 手动使用 exec 方法（需注意 lastIndex）
regex.exec('abca'); // ['a']（第一次匹配，lastIndex=1）
regex.exec('abca'); // ['a']（第二次匹配，lastIndex=4）
regex.exec('abca'); // null（第三次匹配失败，lastIndex=0）
```

#### 2. **陷阱解析**

- **共享状态**：同一个正则实例的 `lastIndex` 会在多次调用间共享。
- **错误场景**：若忘记重置 `lastIndex`，后续匹配会从错误位置开始。

#### 3. **安全使用方式**

```javascript
// 方式一：每次创建新实例
function findAll(str) {
  const regex = /a/g; // 每次创建新的正则对象
  let matches = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

// 方式二：手动重置 lastIndex
const regex = /a/g;
regex.lastIndex = 0; // 调用前重置
regex.exec('abca'); // 确保从位置0开始
```

### 四、最佳实践总结

1. **避免共享全局正则**：在循环或多次调用中，优先每次创建新的正则实例。
2. **显式重置 `lastIndex`**：若必须复用正则，调用前手动设置 `regex.lastIndex = 0`。
3. **优先使用高级方法**：如 `match()`、`replace()`，避免手动管理 `lastIndex`。

**错误示例**：

```javascript
const regex = /a/g;
console.log(regex.exec('abca')); // ['a']（lastIndex=1）
console.log(regex.exec('abca')); // ['a']（从位置1开始，错误！）
```

**正确示例**：

```javascript
// 每次创建新实例
console.log(/a/g.exec('abca')); // ['a']
console.log(/a/g.exec('abca')); // ['a']（重新从位置0开始）
```
