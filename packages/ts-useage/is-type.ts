interface User {
  name: string;
  age?: number;
}

function addAge(user: User) {
  // ❌ 通过索引签名动态添加属性，控制流分析无法跟踪
  user.age = 25;

  // user.age 类型仍为 number | undefined
}

function printAge(user: User) {
  addAge(user);
  // ❌ 虽然 addAge 确保了 age 存在，但 TypeScript 不知道
  console.log(user.age.toFixed(0)); // 编译错误：可能为 undefined
}
