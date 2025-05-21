// class Mypromise {
//   constructor(parameters) {}
// }
// // 测试代码
// let promise = new Mypromise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve('成功');
//     reject('失败');
//   }, 1000);
// });

// promise
//   .then(null, (reason) => {
//     console.log(reason); // 输出：成功
//     return Mypromise.reject('1111');
//   })
//   .then(
//     (value) => {
//       console.log(value); // 输出：成功!
//     },
//     (value) => {
//       console.log(value); // 输出：失败!
//     },
//   );
