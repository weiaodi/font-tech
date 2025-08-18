// function isStringNormal(test: any): boolean {
//   return typeof test === 'string'; // TypeScript 不分析这个逻辑
// }

// function printValue(x: string | number) {
//   if (isStringNormal(x)) {
//     // ❌ TypeScript 不知道 x 是 string，因为 isStringNormal 返回 boolean

//     x.toUpperCase(); // 错误：number 没有 toUpperCase
//   }
// }

// function isString(test: any): test is string {
//   return typeof test === 'string'; // 实现必须与声明一致
// }

// function printValue(x: string | number) {
//   if (isString(x)) {
//     // ✅ TypeScript 知道 x 是 string，因为 isString 的返回类型是 test is string

//     x.toUpperCase(); // 安全
//   }
// }
