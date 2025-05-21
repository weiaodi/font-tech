import './db1.js';
import './db2.js';

const counter = require('./counter.js');

console.log('初始 count:', counter.count); // 0
counter.increment(); // 内部 count: 1
console.log('拷贝的 count:', counter.count); // 0（拷贝的值不会更新）
console.log('实时 count:', counter.getCount()); // 1（通过方法获取实时值）
