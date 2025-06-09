// 双向链表节点
// eslint-disable-next-line max-classes-per-file
class DLinkedNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.freq = 1;
    this.prev = null;
    this.next = null;
  }
}

// 双向链表
class DLinkedList {
  constructor() {
    this.head = new DLinkedNode(0, 0); // 虚拟头节点
    this.tail = new DLinkedNode(0, 0); // 虚拟尾节点
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  // 在链表头部添加节点
  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
    this.size++;
  }

  // 删除链表中的节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
  }

  // 删除链表中最后一个节点并返回
  removeTail() {
    if (this.size === 0) return null;
    const lastNode = this.tail.prev;
    this.removeNode(lastNode);
    return lastNode;
  }
}

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // key -> DLinkedNode
    this.freqMap = new Map(); // freq -> DLinkedList
    this.minFreq = 0; // 当前最小频率
  }

  // 获取 key 对应的值，更新频率
  get(key) {
    if (!this.cache.has(key) || this.capacity === 0) {
      return -1;
    }

    const node = this.cache.get(key);
    this._updateFreq(node);
    return node.value;
  }

  // 添加或更新键值对
  put(key, value) {
    if (this.capacity <= 0) return;

    // 如果 key 已存在，更新值和频率
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this._updateFreq(node);
      return;
    }

    // 如果 key 不存在，插入新值
    // 容量已满的话需要淘汰一个频率最小的 key
    if (this.cache.size === this.capacity) {
      this._evict();
    }

    // 插入新值，频率为 1
    const newNode = new DLinkedNode(key, value);
    this.cache.set(key, newNode);

    // 添加到频率为 1 的桶
    if (!this.freqMap.has(1)) {
      this.freqMap.set(1, new DLinkedList());
    }
    this.freqMap.get(1).addToHead(newNode);

    // 插入新 key 后最小频率一定是 1
    this.minFreq = 1;
  }

  // 更新节点频率
  _updateFreq(node) {
    const freq = node.freq;

    // 从旧频率对应的链表中删除节点
    const oldList = this.freqMap.get(freq);
    oldList.removeNode(node);

    // 如果旧频率对应的链表为空，移除该频率
    if (oldList.size === 0) {
      this.freqMap.delete(freq);
      // 如果这个频率恰好是 minFreq，更新 minFreq
      if (freq === this.minFreq) {
        this.minFreq++;
      }
    }

    // 频率 +1
    node.freq++;

    // 将节点添加到新频率对应的链表
    const newFreq = node.freq;
    if (!this.freqMap.has(newFreq)) {
      this.freqMap.set(newFreq, new DLinkedList());
    }
    this.freqMap.get(newFreq).addToHead(node);
  }

  // 淘汰频率最小的元素
  _evict() {
    // 获取最小频率对应的链表
    const list = this.freqMap.get(this.minFreq);

    // 删除链表的尾部节点（最久未使用）
    const tailNode = list.removeTail();
    this.cache.delete(tailNode.key);

    // 如果链表为空，移除该频率
    if (list.size === 0) {
      this.freqMap.delete(this.minFreq);
    }
  }
}
