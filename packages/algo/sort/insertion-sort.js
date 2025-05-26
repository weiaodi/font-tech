function insertionSort(arr) {
  for (let cur = 1; cur < arr.length; cur++) {
    const base = arr[cur];
    let sorted = cur - 1;
    while (sorted && arr[sorted] > base) {
      arr[sorted + 1] = arr[sorted];
      sorted--;
    }
    // sorted指向第一个小于base的元素
    arr[sorted + 1] = base;
  }
  return arr;
}
insertionSort([1, 3, 52, 5, 9]);
console.log('🚀 ~ insertionSort([1, 3, 52, 5, 9]):', insertionSort([1, 3, 52, 5, 9]));
