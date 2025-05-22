// WeakMap 的键必须是对象，并且当对象的其他引用被释放后，WeakMap 中的引用也会自动被垃圾回收
const targetMap = new WeakMap();

// 依赖收集函数，用于收集目标对象的某个属性所依赖的副作用函数
function track(target, key) {
  // 从 targetMap 中获取目标对象对应的依赖映射（depsMap）
  let depsMap = targetMap.get(target);
  // 如果 targetMap 中没有该目标对象的依赖映射
  if (!depsMap) {
    // 则创建一个新的 Map 作为该目标对象的依赖映射，并存储到 targetMap 中
    targetMap.set(target, (depsMap = new Map()));
  }
  // 从依赖映射（depsMap）中获取该属性对应的副作用函数集合（dep）
  let dep = depsMap.get(key);
  // 如果依赖映射中没有该属性的副作用函数集合
  if (!dep) {
    // 则创建一个新的 Set 作为该属性的副作用函数集合，并存储到依赖映射中
    depsMap.set(key, (dep = new Set()));
  }
  // 这里简化处理，假设当前有一个 activeEffect 表示正在收集依赖的副作用
  // 如果存在正在收集依赖的副作用函数
  if (activeEffect) {
    // 将该副作用函数添加到该属性的副作用函数集合中
    dep.add(activeEffect);
  }
}

// 触发更新函数，用于在目标对象的某个属性值发生变化时，触发依赖该属性的副作用函数重新执行
function trigger(target, key) {
  // 从 targetMap 中获取目标对象对应的依赖映射（depsMap）
  const depsMap = targetMap.get(target);
  // 如果 targetMap 中没有该目标对象的依赖映射，直接返回
  if (!depsMap) {
    return;
  }
  // 从依赖映射（depsMap）中获取该属性对应的副作用函数集合（dep）
  const dep = depsMap.get(key);
  // 如果存在该属性的副作用函数集合
  if (dep) {
    // 遍历该副作用函数集合，并依次执行每个副作用函数
    dep.forEach((effect) => effect());
  }
}

// reactive 函数，用于将一个普通对象转换为响应式对象
function reactive(target) {
  // 使用 Proxy 创建目标对象的代理对象
  return new Proxy(target, {
    // get 拦截器，当访问代理对象的属性时触发
    get(target, key, receiver) {
      // 调用 track 函数进行依赖收集
      track(target, key);
      // 使用 Reflect.get 方法获取目标对象的属性值并返回
      return Reflect.get(target, key, receiver);
    },
    // set 拦截器，当设置代理对象的属性值时触发
    set(target, key, value, receiver) {
      // 保存属性的旧值
      const oldValue = target[key];
      // 使用 Reflect.set 方法设置目标对象的属性值，并获取操作结果
      const result = Reflect.set(target, key, value, receiver);
      // 如果操作成功且属性值发生了变化
      if (result && oldValue !== value) {
        // 调用 trigger 函数触发依赖该属性的副作用函数重新执行
        trigger(target, key);
      }
      // 返回操作结果
      return result;
    },
  });
}

// 简化的副作用函数，用于记录当前正在收集依赖的副作用函数
let activeEffect;
function effect(fn) {
  // 将传入的副作用函数赋值给 activeEffect
  activeEffect = fn;
  // 执行副作用函数，在执行过程中会触发依赖收集
  fn();
  // 副作用函数执行完毕后，将 activeEffect 置为 null
  activeEffect = null;
}

// 使用示例
// 创建一个响应式对象 state，初始值为 { count: 0 }
const state = reactive({
  count: 0,
});

// 创建一个副作用函数，当 state.count 发生变化时，会重新执行该函数并打印新的 count 值
effect(() => {
  console.log('Count:', state.count);
});

// 修改 state.count 的值，触发更新，控制台会输出新的 count 值
state.count++;
