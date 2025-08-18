// // 装饰器工厂，接收两个参数：是否单例，以及要拦截的访问方法名
// function disposeDecorator(isSingleton: boolean, accessMethodName: string) {
//   // 返回实际的装饰器函数
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
//     // 验证：只能应用在dispose方法上
//     if (propertyKey !== 'dispose') {
//       throw new Error('此装饰器只能应用在dispose方法上');
//     }

//     // 验证访问方法是否存在
//     if (typeof target[accessMethodName] !== 'function') {
//       throw new Error(`类中不存在名为${accessMethodName}的方法`);
//     }

//     // 保存原始访问方法
//     const originalAccessMethod = target[accessMethodName];

//     // 如果是非单例模式，重写访问方法,每次访问前先调用删除方法
//     if (!isSingleton) {
//       target[accessMethodName] = function (...args: any[]) {
//         // 先调用dispose方法
//         this.dispose();
//         // 再执行原始访问方法
//         return originalAccessMethod.apply(this, args);
//       };
//     }

//     // 返回dispose方法的描述符（不修改dispose本身）
//     return descriptor;
//   };
// }

// // 使用示例
// class ResourceManager {
//   private resource: string | null;

//   constructor() {
//     this.resource = '初始化资源';
//     console.log('资源已创建');
//   }

//   // 应用装饰器：单例模式为true，拦截accessResource方法
//   @disposeDecorator(true, 'accessResource')
//   dispose() {
//     console.log('执行dispose - 释放资源');
//     this.resource = null;
//   }

//   // 被拦截的访问方法
//   accessResource() {
//     console.log('执行accessResource方法');
//     return this.resource ? `访问资源: ${this.resource}` : '资源已被释放';
//   }

//   // 其他方法不受影响
//   otherMethod() {
//     console.log('执行otherMethod方法');
//   }
// }

// // 测试
// const manager = new ResourceManager();
// manager.accessResource(); // 会先调用dispose，再执行本身
// manager.accessResource(); // 再次调用，依然先执行dispose
// manager.otherMethod(); // 不受影响，不会触发dispose
