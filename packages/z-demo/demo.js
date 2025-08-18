// 1. 定义一个对象
const obj = { name: '测试对象' };

// 2. 在一个普通函数调用中，给obj添加方法
function addMethod(target) {
  target.sayHello = function () {
    console.log(this.name); // 这里的this与addMethod的this无关
  };
}

// 3. 普通调用addMethod（此时addMethod内部的this是window/undefined）
addMethod(obj);

// 4. 调用obj的sayHello方法
obj.sayHello(); // 输出："测试对象"（this指向obj）
