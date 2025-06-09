let str = 'HELLO WORLD';
let n = str.charAt(2);
let str1 = 'Hello ';
let str2 = 'world!';
let n1 = str1.concat(str2);
let str3 = 'Hello world';
str3.endsWith('world'); // 返回 true
str3.endsWith('World'); // 返回 false
let str11 = 'Hello world, welcome to the universe.';
let n11 = str11.indexOf('welcome');
let str111 = 'Runoob';
str111.repeat(2);
let str12 = 'Mr Blue has a blue house and a blue car';
let n12 = str12.replace(/blue/g, 'red');
let str21 = 'Visit Runoob!';
let n21 = str21.search('Runoob');
let strr = 'Hello world!';
let nr = strr.slice(1, 5);
// 不包含结尾
/* 
### 负索引支持
- **`slice()`**：支持负索引，负数表示从字符串末尾开始计数，如 `-1` 代表最后一个字符，`-2` 代表倒数第二个字符等。
- **`substring()`**：不支持负索引，若传入负数，会被当作 `0` 处理。

### 参数顺序处理
- **`slice()`**：当 `startIndex` 大于 `endIndex` 时，返回空字符串。
- **`substring()`**：若 `startIndex` 大于 `endIndex`，会自动交换这两个参数的值，然后进行提取操作。

### 方法用途侧重
- **`slice()`**：功能更强大，适合需要灵活操作字符串、使用负索引从字符串末尾开始提取子字符串的场景。
- **`substring()`**：语义更简单，适用于仅进行常规正向索引提取、不涉及负索引的简单场景。 
*/
let nr1 = strr.substring(1, 5);
console.log('🚀 ~ nr11111111:', nr, nr1);
let strq = 'How are you doing today?';
let nq = strq.split(' ');
console.log('🚀 ~ nq:', nq);
let strx = '       Runoob        ';
strx.trim();
console.log('🚀 ~ strx.trim():', strx.trim());
