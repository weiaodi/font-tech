/* eslint-disable max-classes-per-file */
class DpNode {
  constructor(value, key, pre, next) {
    this.pre = pre || null;
    this.next = next || null;
    this.value = value || 0;
    this.key = key || 0;
  }
}

class LRUCache {
  constructor(size) {
    this.size = size;
    this.map = new Map();
    this.curSize = 0;
    this.head = new DpNode();
    this.end = new DpNode();
    this.head.next = this.end;
    this.end.pre = this.head;
  }
  addToHead(node) {
    // head-a-b   c
    const next = this.head.next;
    this.head.next = node;
    node.pre = this.head;
    node.next = next;
    next.pre = node;
  }
  deleteNode(node) {
    const pre = node.pre;
    const next = node.next;
    pre.next = next;
    next.pre = pre;
  }
  // 获取数值的时候会更新下链表的顺序
  get(key) {
    if (this.map.get(key)) {
      const curNode = this.map.get(key);
      // 更新节点在链表中的顺序, 先删除当前节点的位置,然后移动到头结点的位置
      this.deleteNode(curNode);
      this.addToHead(curNode);
      return curNode.value;
    }
    return -1;
  }
  put(key, value) {
    // 如果存在直接更新数值
    if (this.map.get(key)) {
      const node = this.map.get(key);
      node.value = value;
      // 同时更新当前节点的位置
      this.deleteNode(node);
      this.addToHead(node);
    } else if (this.curSize < this.size) {
      // 不存在应该创建新节点
      const newNode = new DpNode(value, key);
      // 放到链表头
      this.addToHead(newNode);
      this.map.set(key, newNode);
      this.curSize++;
    } else {
      // 超出的情况
      // 拿出最后一个节点,
      const endNode = this.end.pre;
      // 在map和链表中删除该节点,
      this.map.delete(endNode.key);
      this.deleteNode(endNode);
      // 然后设置新的数值,插入链表和map中
      const newNode = new DpNode(value, key);
      this.map.set(key, newNode);
      this.addToHead(newNode);
    }
  }
}
// LruCache. put（2, 2）；1/ 缓存= ｛1=1，2=2｝
// console.LogCLruCache.get（1））
const lruCache = new LRUCache(1);

lruCache.put(2, 11111); // 缓存 = ｛1=1｝
console.log(lruCache.get(2));
lruCache.put(3, 2);
console.log(lruCache.get(2));
