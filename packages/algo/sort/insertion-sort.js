function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let currentSort = arr[i];
    let lastSortedIndex = i - 1;
    while (lastSortedIndex > 0 && arr[lastSortedIndex] > currentSort) {
      arr[lastSortedIndex + 1] = arr[lastSortedIndex];
      lastSortedIndex--;
    }
    let insertIndex = lastSortedIndex + 1;
    arr[insertIndex] = currentSort;
  }
  return arr;
}
insertionSort([1, 3, 52, 5, 9]);
console.log('🚀 ~ insertionSort([1, 3, 52, 5, 9]):', insertionSort([1, 3, 52, 5, 9]));
