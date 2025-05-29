/* eslint-disable */
export default {
  name: 'keep-alive',
  abstract: true, // 抽象组件，不渲染真实 DOM

  props: {
    include: [String, RegExp, Array], // 白名单
    exclude: [String, RegExp, Array], // 黑名单
    max: [String, Number], // 最大缓存数量
  },

  created() {
    this.cache = Object.create(null); // 存储缓存的 VNode
    this.keys = []; // 存储缓存组件的 key
  },

  destroyed() {
    // 销毁时清空所有缓存
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    // 监听白名单/黑名单变化，动态更新缓存
    this.$watch('include', (val) => {
      pruneCache(this, (name) => matches(val, name));
    });
    this.$watch('exclude', (val) => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },

  render() {
    // 获取第一个子组件的 VNode
    const vnode = getFirstComponentChild(this.$slots.default);
    const componentOptions = vnode && vnode.componentOptions;

    if (componentOptions) {
      const name = getComponentName(componentOptions);

      // 根据白名单/黑名单判断是否缓存
      if (
        (this.include && (!name || !matches(this.include, name)))
        || (this.exclude && name && matches(this.exclude, name))
      ) {
        return vnode;
      }

      const key =
        vnode.key == null
          ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key;

      // 命中缓存：从缓存中获取组件实例并更新 key 顺序
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
        // 更新 key 顺序，将当前 key 移到最后（表示最近使用）
        remove(this.keys, key);
        this.keys.push(key);
      }
      // 未命中缓存：缓存当前组件实例
      else {
        this.cache[key] = vnode;
        this.keys.push(key);

        // 超过最大缓存数时，淘汰最久未使用的组件
        if (this.max && this.keys.length > parseInt(this.max)) {
          pruneCacheEntry(this.cache, this.keys[0], this.keys);
        }
      }

      // 标记该组件需要被缓存，在 patch 过程中会特殊处理
      vnode.data.keepAlive = true;
    }

    return vnode || (this.$slots.default && this.$slots.default[0]);
  },
};
