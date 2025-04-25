// 使用示例
const effectObjectFnMaps = new WeakMap();

// 收集对象对应属性的副作用函数
function track(obj, key) {
  let effectFnMaps = effectObjectFnMaps.get(obj);
  if (!effectFnMaps) {
    effectObjectFnMaps.set(obj, (effectFnMaps = new Map()));
  }
  let effectFns = effectFnMaps.get(key);
  if (!effectFns) {
    // 在依赖收集的场景下，每个副作用函数只应该被收集一次，避免重复执行相同的副作用函数
    effectFnMaps.set(key, (effectFns = new Set()));
  }
  // 如果存在需要收集的依赖则
  if (activeEffect) {
    effectFns.add(activeEffect);
  }
}

// 获取对象对应属性的副作用函数
function trigger(obj, key) {
  const effectFnMaps = effectObjectFnMaps.get(obj);
  if (!effectFnMaps) {
    return;
  }
  const effectFns = effectFnMaps.get(key);
  if (effectFns) {
    effectFns.forEach((fn) => {
      fn();
    });
  }
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 副作用函数收集 返回原值
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      // 新旧数值对比,如果不同则触发副作用函数
      const oldValue = target[key];
      const result = Reflect.set(target, key, newValue, receiver);
      // 如果操作成功且属性值发生了变化
      if (result && oldValue !== newValue) {
        trigger(target, key);
      }

      return result;
    },
  });
}
let activeEffect = null;
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}
// 创建一个响应式对象 state，初始值为 { count: 0 }
const state = reactive({
  count: 0,
});

// 创建一个副作用函数，当 state.count 发生变化时，会重新执行该函数并打印新的 count 值
effect(() => {
  console.log('Count:', state.count);
});
effect(() => {
  console.log('Count1:', state.count);
});

// 修改 state.count 的值，触发更新，控制台会输出新的 count 值
state.count++;
