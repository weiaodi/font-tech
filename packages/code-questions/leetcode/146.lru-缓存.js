/*
 * @lc app=leetcode.cn id=146 lang=javascript
 *
 * [146] LRU 缓存
 */

// @lc code=start
/**
 * @param {number} capacity
 */
class DLinkList {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.pre = null;
    this.next = null;
  }
}
let LRUCache = function (capacity) {
  this.cache = new Map();
  this.head = new DLinkList();
  this.tail = new DLinkList();
  this.head.next = this.tail;
  this.tail.pre = this.head;
  this.capacity = capacity;
  this.size = 0;
};
LRUCache.prototype.delete = function (node) {
  const pre = node.pre;
  const next = node.next;
  pre.next = next;
  next.pre = pre;
};
LRUCache.prototype.addtoHead = function (node) {
  const next = this.head.next;
  this.head.next = node;
  node.pre = this.head;

  node.next = next;
  next.pre = node;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  // 缓存中读取数值 将当前数值移动到链表头部  先删除,再添加
  if (this.cache.has(key)) {
    const node = this.cache.get(key);
    this.delete(node);
    this.addtoHead(node);
    return node.value;
  }
  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  //  先判断key是否存在  如果存在则更新value数值 如果不存在添加新数值到缓存
  if (this.cache.has(key)) {
    const node = this.cache.get(key);
    node.value = value;
    this.delete(node);
    this.addtoHead(node);
  } else {
    const node = new DLinkList(key, value);
    this.cache.set(key, node);
    this.addtoHead(node);
    this.size++;
    if (this.size > this.capacity) {
      this.cache.delete(this.tail.pre.key);
      this.delete(this.tail.pre);
      this.size--;
    }
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end
