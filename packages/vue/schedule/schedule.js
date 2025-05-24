// 存储依赖关系的桶
const bucket = new WeakMap();
// 当前激活的副作用函数
let activeEffect = null;
// 用于存储当前激活的副作用函数，主要解决副作用嵌套导致的依赖相互影响的问题
const effectStack = [];

// 调度队列， 利用 Set 数据结构去重
const jobQueue = new Set();
// 标记是否正在刷新队列
let isFlushing = false;

// 创建一个响应式对象
function reactive(target) {
  return new Proxy(target, {
    // 拦截读取操作 - 收集依赖追踪变化
    get(target, key) {
      // 将副作用函数 activeEffect 添加到存储到依赖关系桶中
      track(target, key);
      return target[key];
    },
    // 拦截设置操作 - 触发依赖更新
    set(target, key, value) {
      target[key] = value;
      // 把副作用函数从桶里取出并执行
      trigger(target, key);
      return true;
    },
  });
}

// 收集依赖，跟踪依赖关系
function track(target, key) {
  if (!activeEffect) return;
  // 获取响应式对象所有字段的依赖关系 depsMap (Map 数据类型)
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  // 获取该当前段的依赖集合 deps (Set 数据类型)
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 将当前副作用加入依赖集合，收集依赖
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

// 触发依赖更新
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  // 获取该字段所欲依赖副作用函数并执行
  const effects = depsMap.get(key);

  // 重新用 Set 构造并遍历，解决直接遍历 effects 集合，可能导致的无限执行问题
  const effectsToRun = new Set();
  effects
    && effects.forEach((effectFn) => {
      // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行，避免无限循环栈溢出
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 将需要执行的副作用函数加入调度队列
  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      jobQueue.add(effectFn);
    }
  });

  // 如果当前没有正在执行调度队列中的任务，则调用 queueFlush 函数开始调度
  if (!isFlushing) {
    isFlushing = true;
    queueFlush();
  }
}

// 清理旧的依赖关系，目的是清除可能会产生遗留的副作用函数，例如三元表达式等条件分支产生遗留的副作用函数
function cleanup(effectFn) {
  for (let deps of effectFn.deps) {
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

// 创建一个副作用函数
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
    activeEffect = effectFn;
    // 在调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn);
    fn();
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  // 存储所有与该副作用函数关联的依赖集合，用于准确清理
  effectFn.deps = [];

  effectFn.options = options;

  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    // 执行副作用函数
    effectFn();
  }
  // 将副作用函数作为返回值返回
  return effectFn;
}

// 调度器
function queueFlush() {
  Promise.resolve().then(flushJobs);
}

// 执行调度队列中的任务
function flushJobs() {
  jobQueue.forEach((job) => job());
  jobQueue.clear();
  isFlushing = false;
}

// 示例使用
const data = { text: 'hello' };
const state = reactive(data);

effect(() => {
  console.log(state.text); // 输出: hello
});

setTimeout(() => {
  state.text = 'world'; // 输出: world
}, 1000);

// 带有调度器的副作用函数
effect(
  () => {
    console.log('Scheduled effect:', state.text);
  },
  {
    scheduler: (effectFn) => {
      // 自定义调度逻辑，例如防抖、节流等
      setTimeout(effectFn, 1000);
    },
  },
);
