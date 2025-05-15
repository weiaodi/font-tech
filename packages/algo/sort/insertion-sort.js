function insertionSort(arr) {
  //  选取一个基准元素,尝试将他插入到前面的有序队列中
  for (let cur = 1; cur < arr.length; cur++) {
    let base = arr[cur];
    let sorted = cur - 1;
    while (sorted >= 0 && base < arr[sorted]) {
      arr[sorted + 1] = arr[sorted];
      sorted--;
    }
    arr[sorted + 1] = base;
  }
  return arr;
}
insertionSort([1, 3, 52, 5, 9]);
console.log('🚀 ~ insertionSort([1, 3, 52, 5, 9]):', insertionSort([1, 3, 52, 5, 9]));
