function insertionSort(arr) {
  //  选取一个基准元素,尝试将他插入到前面的有序队列中
  for (let i = 1; i < arr.length; i++) {
    const base = arr[i];
    let sorted = i - 1;
    // 1534   base3  从21开始进行比较插入当前元素
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
