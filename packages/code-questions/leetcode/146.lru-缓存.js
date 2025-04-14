/*
 * @lc app=leetcode.cn id=146 lang=javascript
 *
 * [146] LRU 缓存
 */

// @lc code=start
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.pre = null;
    this.next = null;
  }
}
/**
 * @param {number} capacity
 */
let LRUCache = function (capacity) {
  this.capacity = capacity;
  this.cache = new Map();
  this.head = new Node(0, 0);
  this.tail = new Node(0, 0);
  this.head.next = this.tail;
  this.tail.pre = this.head;
};
LRUCache.prototype.insert = function (node) {
  // 每次插入节点到头部
  const nextNode = this.head.next;
  this.head.next = node;
  node.pre = this.head;
  node.next = nextNode;
  nextNode.pre = node;
};
LRUCache.prototype.delete = function (node) {
  const nextNode = node.next;
  const preNode = node.pre;
  nextNode.pre = preNode;
  preNode.next = nextNode;
};
/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  // 因为元素被获取,所有需要更新到头部
  if (this.cache.has(key)) {
    const node = this.cache.get(key);
    this.delete(node);
    this.insert(node);
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
  if (this.cache.has(key)) {
    const node = this.cache.get(key);
    this.delete(node);
  }
  const newNode = new Node(key, value);
  this.cache.set(key, newNode);
  this.insert(newNode);
  if (this.cache.size > this.capacity) {
    const oldNode = this.tail.pre;
    this.delete(oldNode);
    // 不可直接传入key的原因是 如果当前的key不是旧的节点 就应该更新后再删除原来旧的节点
    this.cache.delete(oldNode.key);
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end
