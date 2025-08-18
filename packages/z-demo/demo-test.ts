// // 单例装饰器实现
// function singleton<T extends new (...args: any[]) => {}>(constructor: T) {
//   let instance: InstanceType<T>;

//   // 返回一个新的构造函数
//   return class extends constructor {
//     constructor(...args: any[]) {
//       // 检查是否已有实例
//       if (instance) {
//         return instance;
//       }

//       // 调用原始构造函数
//       super(...args);

//       // 保存实例
//       instance = this;

//       // 防止通过 Object.create 等方式创建新实例
//       Object.freeze(instance);
//     }
//   };
// }

// // 使用示例
// @singleton
// class Database {
//   private connectionString: string;

//   constructor(connectionString: string) {
//     this.connectionString = connectionString;
//   }

//   connect() {
//     console.log(`Connecting to ${this.connectionString}`);
//   }
// }

// // 测试单例效果
// const db1 = new Database('mongodb://localhost:27017/db111111');
// const db2 = new Database('mongodb://localhost:27017/db2');

// // 虽然传入不同参数，但会得到同一个实例
// console.log(db1 === db2); // 输出: true
// console.log(db1); // 仍然使用第一个实例的连接字符串
