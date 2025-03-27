/*
 * @Author: weiaodi 1635654853@qq.com
 * @Date: 2025-03-26 11:28:54
 * @LastEditors: weiaodi 1635654853@qq.com
 * @LastEditTime: 2025-03-26 12:39:29
 * @FilePath: /FontTech_monoRepo/packages/algo/loops/loop-usage.js
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

let table = {
  a: 10,
  b: true,
  c: 'jadeshu',
};

for (let index in table) {
  console.log(index, table[index]);
}
let array = [1, 2, 3, 4, 5, 6, 1111];

for (let ele of array) {
  console.log(ele);
}

let str = 'helloabc';
for (let ele of str) {
  console.log(ele);
}
