let a = '1221';
// abccba 回文
// 检测字符串是否为回文特征
// function check(str) {
//   let left = [];
//   let right = [];
//   let mid = str.length / 2;
//   for (let i = 0, j = str.length - 1; i < mid; i++, j--) {
//     left.push(str[i]);
//     right.push(str[j]);
//   }
//   //   比较left和right是否相等
//   let flag = 0;
//   left.forEach((e, i) => {
//     if (e === right[i]) {
//       flag = 1;
//     } else {
//       flag = 0;
//     }
//   });
//   return flag === 1;
// }
