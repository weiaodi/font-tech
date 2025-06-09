/*
1.小顶堆功能
   获取左,右节点,父元素
   获取堆顶元素
   获取堆的大小
   交换堆内元素
   堆上浮,下沉
   取出堆顶元素 */

class MinHeap {
  constructor(heap = []) {
    this.heap = heap;
  }
  #left(i) {
    return i * 2 + 1;
  }
  #right(i) {
    return i * 2 + 2;
  }
  #parent(i) {
    return Math.floor((i - 1) / 2);
  }
  size() {
    return this.heap.length;
  }
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  //   判断当前元素是否大于其父节点,如果大于则交换
  shiftUp(i) {
    // 上浮操作中,最终上浮到根节点
    while (i > 0) {
      if (this.heap[this.#parent(i)] <= this.heap[i]) {
        break;
      }
      this.swap(i, this.#parent(i));
      //   继续进行交换
      i = this.#parent(i);
    }
  }
  //   元素向下比较,进行下浮
  shiftDown(i) {
    while (true) {
      let smallestIndex = i;
      // 向下和左右子节点比较,如当前位置无需交换则退出循环
      if (this.#left(i) < this.size() && this.heap[this.#left(i)] < this.heap[i]) {
        smallestIndex = this.#left(i);
      }
      if (this.#right(i) < this.size() && this.heap[this.#right(i)] < this.heap[i]) {
        smallestIndex = this.#right(i);
      }
      if (smallestIndex === i) {
        break;
      }
      // 如果需要交换,则交换元素和交换当前索引位置
      this.swap(i, smallestIndex);
      i = smallestIndex;
    }
  }
  //   从堆底部插入,然后进行上浮操作
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  /*
判断元素数量为0,1的情况
先对堆顶和堆底元素交换然后删除堆底部元素,
再对堆进行从上到下进行下沉 */
  extractMin() {
    if (this.size === 0) {
      return null;
    }
    if (this.size === 1) {
      return this.heap.pop();
    }
    const min = this.heap[0];
    // 写法过于简陋
    // this.swap(this.heap[0], this.heap[this.heap.length - 1]);
    // this.heap.pop();
    this.heap[0] = this.heap.pop();
    this.shiftDown(this.heap[0]);
    return min;
  }
  peek() {
    return this.size() > 0 ? this.heap[0] : null;
  }
}
const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
// 小顶堆测试
const minHeap = new MinHeap();
numbers.forEach((num) => minHeap.insert(num));
console.log('小顶堆', minHeap.heap);
console.log('小顶堆堆顶元素:', minHeap.peek());
console.log('小顶堆删除堆顶元素:', minHeap.extractMin());
console.log('小顶堆新堆顶元素:', minHeap.peek());
function topK(arr, k) {
  const minHeap = new MinHeap();
  //   初始化堆
  for (let i = 0; i < k; i++) {
    minHeap.insert(arr[i]);
  }
  //
  for (let i = k; i < arr.length; i++) {
    if (arr[i] > minHeap.peek()) {
      minHeap.extractMin();
      minHeap.insert(arr[i]);
    }
  }
  return minHeap.heap;
}
// 示例用法
const nums = [3, 2, 1, 5, 6, 4];
const k = 2;
const result = topK(nums, 5);
console.log(result);
