const originalObj = {
  name: 'Tom',
  sayName() {
    return `My name is ${this.name}`;
  },
};

const newContext = {
  name: 'Jerry',
};

// 使用 Reflect.get 获取方法，并指定 receiver
const methodWithReceiver = Reflect.get(originalObj, 'sayName', newContext);

// 不使用 call 指定 this
console.log(methodWithReceiver());

// 使用 call 指定 this
// 这里返回了一个this为newContext的 originalobj的属性  当前他只是一个普通的属性方法,如果想正确调用他,也应该把this指向newcontext
console.log(methodWithReceiver.call(newContext));
/* 
1. Reflect.get 中 receiver 的作用
Reflect.get 方法的签名是 Reflect.get(target, propertyKey[, receiver])。当调用 Reflect.get(originalObj, 'sayName', newContext) 时，传入的 receiver 参数 newContext 会影响属性（这里是方法 sayName）的查找和获取过程。
具体来说，Reflect.get 会尝试从 target 对象（也就是 originalObj）中获取指定的属性（sayName 方法），并且在获取这个属性时，会把 this 绑定到 receiver 对象（newContext）上。不过，Reflect.get 只是获取了方法，此时并没有真正调用这个方法。
2. 使用 call 方法再次指定 this 的原因
call 方法是 JavaScript 中函数对象的一个方法，它的作用是调用函数并且指定函数内部 this 的值。当使用 Reflect.get 获取到 sayName 方法后，将其赋值给 methodWithReceiver，这只是得到了一个普通的函数引用。
如果直接调用 methodWithReceiver()，而不使用 call 方法指定 this，那么这个方法调用时的 this 指向会根据调用上下文来确定。在非严格模式下，如果是全局作用域调用，this 会指向全局对象（浏览器环境中是 window）；在严格模式下，this 会是 undefined。
为了确保在调用 sayName 方法时，this 确实指向 newContext 对象，就需要使用 call 方法，并把 newContext 作为第一个参数传入，即 methodWithReceiver.call(newContext)。这样，在 sayName 方法内部，this 就会指向 newContext 对象，从而可以正确访问 newContext 对象的属性。

*/
