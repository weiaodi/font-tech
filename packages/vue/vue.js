/* eslint-disable */
function h(type, props, children) {
  return {
    type,
    props,
    children: Array.isArray(children) ? children : String(children),
  };
}

function mount(vNode, container) {
  const { type, props, children } = vNode;
  // 把真实的dom元素记录在el属性上
  const el = (vNode.el = document.createElement(type));
  // 链接父元素
  el.parent = container;

  // 处理属性，事件或普通属性
  Object.keys(props).forEach((key) => {
    if (isEvent(key)) {
      el.addEventListener(key.toLowerCase().substring(2), props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  });

  if (typeof children === 'string') {
    el.textContent = children;
  } else {
    children.forEach((child) => mount(child, el));
  }
  container.appendChild(el);
}

function isEvent(prop) {
  return prop.startsWith('on');
}
function isProp(prop) {
  return !isEvent(prop);
}
function patch(oldVnode, vnode) {
  const { type: oldType, props: oldProps, children: oldChildren, el } = oldVnode;
  const { type, props, children } = vnode;
  vnode.el = el;
  vnode.parent = vnode.parent;

  // 完全不同的节点
  if (oldType !== type) {
    const parentNode = el.parent;
    parentNode.removeChild(el);
    mount(vnode, parentNodet);
  } else {
    // 移除属性
    Object.keys(oldProps)
      .filter(isProp)
      .filter((key) => !(key in props))
      .forEach((key) => {
        el.removeAttribute(key);
      });

    // 新增属性或者修改属性
    Object.keys(oldProps)
      .filter(isProp)
      .filter((key) => oldProps[key] !== props[key])
      .forEach((key) => {
        el.setAttribute(key, props[key]);
      });

    // 移除事件
    Object.keys(oldProps)
      .filter(isEvent)
      .filter((key) => !(key in props) || oldProps[key] !== props[key])
      .forEach((key) => {
        const eventType = key.toLowerCase().substring(2);
        el.removeEventListener(eventType, oldProps[key]);
      });
    // 新增
    Object.keys(oldProps)
      .filter(isEvent)
      .filter((key) => oldProps[key] !== props[key])
      .forEach((key) => {
        const eventType = key.toLowerCase().substring(2);
        el.addEventListener(eventType, props[key]);
      });
    // 处理children
    if (Array.isArray(children)) {
      if (typeof oldChildren === 'string') {
        el.innerHTML = '';
        children.forEach((child) => mount(child, el));
      } else {
        const commonLen = Math.min(children.length, oldChildren.length);
        for (let i = 0; i < commonLen; i++) {
          patch(oldChildren[i], children[i]);
        }

        // 删除多余节点
        oldChildren.slice(commonLen).forEach(({ el, parent }) => {
          parent.removeChild(el);
        });
        // 新增节点
        children.slice(commonLen).forEach((newVnode) => {
          mount(newVnode, el);
        });
      }
    } else {
      el.innerHTML = '';
      el.textContent = children;
    }
  }
}

let activeEffect = null;

class Dep {
  effects = new Set();
  depend() {
    activeEffect && !this.effects.has(activeEffect) && this.effects.add(activeEffect);
  }
  notifiy() {
    this.effects.forEach((effect) => effect());
  }
}

const globalEffectMap = new WeakMap();
function getDep(target, key) {
  let targetMap = globalEffectMap.get(target);
  if (!targetMap) {
    targetMap = new Map();
    globalEffectMap.set(target, targetMap);
  }
  let keyMap = targetMap.get(key);
  if (!keyMap) {
    keyMap = new Dep();
    targetMap.set(key, keyMap);
  }
  return keyMap;
}

const proxyHandler = {
  get(target, key, receiver) {
    const keyMap = getDep(target, key);
    keyMap.depend();
    return Reflect.get(...arguments);
  },
  set(target, key, value, receiver) {
    const keyMap = getDep(target, key);
    Reflect.set(...arguments);
    keyMap.notifiy();
    return true;
  },
};

function reactive(source) {
  return new Proxy(source, proxyHandler);
}

function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

function createApp(App, containter) {
  let mounted = false;
  let vnode = null;
  watchEffect(() => {
    if (!mounted) {
      vnode = App.render();
      mount(vnode, containter);
      mounted = true;
    } else {
      const newVnode = App.render();
      patch(vnode, newVnode);
      vnode = newVnode;
    }
  });
}

const proxy = reactive({
  count: 1,
});

const App = {
  render() {
    return h('div', { tag: 'div' }, [
      h('button', { onClick: () => proxy.count++ }, proxy.count),
      ...Array.from({ length: proxy.count }).map((v, i) => h('p', { tag: i }, i)),
    ]);
  },
};

createApp(App, document.getElementById('app'));
