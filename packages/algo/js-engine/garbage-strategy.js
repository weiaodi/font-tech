let obj1 = { name: 'object1' };
let obj2 = { name: 'object2' };

// obj1 现在可以通过根对象访问到
// obj2 现在可以通过根对象访问到

obj1 = null;
// obj1 不再被引用，在下一次垃圾回收时可能会被标记为垃圾对象

// 当垃圾回收器执行时，会标记所有可达对象，然后清除未标记的 obj1 所占用的内存
