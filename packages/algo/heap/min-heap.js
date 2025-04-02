class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  siftUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  siftDown(index) {
    const size = this.heap.length;
    while (true) {
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
      let smallestIndex = index;

      if (leftChildIndex < size && this.heap[leftChildIndex] < this.heap[smallestIndex]) {
        smallestIndex = leftChildIndex;
      }

      if (rightChildIndex < size && this.heap[rightChildIndex] < this.heap[smallestIndex]) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === index) break;
      this.swap(index, smallestIndex);
      index = smallestIndex;
    }
  }

  insert(value) {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);
    return min;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }
}

function topKByMinHeap(arr, k) {
  const minHeap = new MinHeap();
  for (let i = 0; i < arr.length; i++) {
    if (minHeap.size() < k) {
      minHeap.insert(arr[i]);
    } else if (arr[i] > minHeap.peek()) {
      minHeap.extractMin();
      minHeap.insert(arr[i]);
    }
  }
  return minHeap.heap;
}

const arr = [3, 2, 1, 5, 6, 4];
const k = 2;
const result = topKByMinHeap(arr, k);
console.log(result);
