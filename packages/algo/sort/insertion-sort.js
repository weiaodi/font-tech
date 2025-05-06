function insertionSort(arr) {
  for (let index = 1; index < arr.length; index++) {
    let curSort = arr[index];
    let lastSorted = index - 1;
    while (lastSorted && curSort < arr[lastSorted]) {
      arr[lastSorted + 1] = arr[lastSorted];
      lastSorted--;
    }
    arr[lastSorted + 1] = curSort;
  }
  return arr;
}
insertionSort([1, 3, 52, 5, 9]);
console.log('🚀 ~ insertionSort([1, 3, 52, 5, 9]):', insertionSort([1, 3, 52, 5, 9]));
