```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}

```

mountComponent 核心就是先实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法，

在此方法中调用 vm.\_render 方法先生成虚拟 Node，最终调用 vm.\_update 更新 DOM。
Watcher 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数。

函数最后判断为根节点的时候设置 vm.\_isMounted 为 true， 表示这个实例已经挂载了，同时执行 mounted 钩子函数。

这里注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。mountComponent 会完成整个渲染工作，包含最核心的 2 个方法：vm.\_render 和 vm.\_update。

1 \_init() 初始化数据、状态等

处理组件配置项
初始化根组件时进行了选项合并操作，将全局配置合并到根组件的局部配置上
初始化每个子组件时做了一些性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率
初始化组件实例的关系属性，比如 $parent、$children、$root、$refs 等
处理自定义事件
调用 beforeCreate 钩子函数
初始化组件的 inject 配置项，得到 ret[key] = val 形式的配置对象，然后对该配置对象进行浅层的响应式处理（只处理了对象第一层数据），并代理每个 key 到 vm 实例上
数据响应式，处理 props、methods、data、computed、watch 等选项
解析组件配置项上的 provide 对象，将其挂载到 vm.\_provided 属性上
调用 created 钩子函数
如果发现配置项上有 el 选项，则自动调用 mount 方法，反之，没提供 el 选项则必须调用 $mount
compile 编译。$mount() 执行 mountComponent, $mount 扩展把 template 和 el 编译 render 函数

2 Parse 解析
Parse 会用正则等方式解析 template 模版中的指令、class、style 等数据，形成 AST。
Optimize 优化
Optimize 的主要作用是标记 static 静态节点，这时 Vue 在编译过程中的优化，后面当 update 更新界面时，会有一个 patch 的过程，diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。
Generate 生成
Generate 是将 AST 转化成 render functio字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。 在经历过 Parse、Optimize 与 Generate 这三个阶段之后，组件中就会得到用于渲染 VNode 所需的 render 函数了。
定义 updateComponent 更新函数。mountComponent() 里面定义了 updateComponent 并 new watcher 实例。new watcher 会走一次 get 方法 触发依赖收集 ，通知 watcher.update。

执行 render 生成虚拟 DOM。updateComponent() 先走 \_render 函数把节点转化成 vnode 传给 \_update()

转化为真实 DOM \_update(): 最终是把虚拟 dom 转化为真实 dom。经过一系列新旧节点对比，走 patch() 打补丁

打补丁 patch(): createElm() 创建子组件 执行他们的 init 方法（里面是解析->优化->生成）
