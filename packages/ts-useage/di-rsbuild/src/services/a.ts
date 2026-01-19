// 1. 定义目标函数的类型契约：参数为 string，返回值为 number
type StringToNumberFn = (str: string) => number;

/**
 * 装饰器工厂：接收参数，返回真正的装饰器（限制 StringToNumberFn 类型）
 * @param logPrefix 自定义日志前缀（传参示例）
 * @returns 方法装饰器
 */
function restrictStringToNumber(logPrefix = '默认前缀') {
  // 内层：真正的方法装饰器（保持类型约束）
  return function <T extends StringToNumberFn>(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    // 增强逻辑：使用外层传入的 logPrefix 参数
    descriptor.value = function (this: any, str: string) {
      // 复用传参：日志前缀
      console.log(
        `[${logPrefix}] 执行函数 ${String(propertyKey)}，参数：${str}`,
      );
      const result = originalMethod.call(this, str);
      console.log(`[${logPrefix}] 函数返回值：${result}`);
      return result;
    } as T; // 保持类型匹配

    return descriptor;
  };
}

// 测试：给装饰器传参（支持自定义配置）
class TestClass {
  // 传参示例1：自定义日志前缀
  @restrictStringToNumber('字符串转数字') // ✅ 传参+类型匹配，无报错
  stringToNum(str: string): number {
    return str.length;
  }

  // 传参示例2：使用默认参数（不传参也可）
  @restrictStringToNumber() // ✅ 无传参，使用默认前缀
  anotherStringToNum(str: string): number {
    return str.split(',').length;
  }

  // ❌ 编译报错：参数类型不匹配（期望 string，实际 number）
  @restrictStringToNumber('错误示例')
  numToNum(num: string): number {
    return 1;
  }

  // ❌ 编译报错：返回值类型不匹配（期望 number，实际 string）
  // @restrictStringToNumber("错误示例")
  stringToString(str: string): string {
    return str.toUpperCase();
  }
}

// 验证效果
const test = new TestClass();
test.stringToNum('hello');
// 输出：[字符串转数字] 执行函数 stringToNum，参数：hello
// 输出：[字符串转数字] 函数返回值：5

test.anotherStringToNum('a,b,c');
// 输出：[默认前缀] 执行函数 anotherStringToNum，参数：a,b,c
// 输出：[默认前缀] 函数返回值：3
