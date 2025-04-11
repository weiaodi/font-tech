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
let nr1 = strr.substring(1, 3);
console.log('🚀 ~ nr11111111:', nr, nr1);
let strq = 'How are you doing today?';
let nq = strq.split(' ');
let strx = '       Runoob        ';
strx.trim();
console.log('🚀 ~ strx.trim():', strx.trim());
