function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let left = [];
  let right = [];
  //   TODO 选取基准值的方式待优化
  let pivot = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    }
    if (arr[i] > pivot) {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
console.log('🚀 ~ quickSort([8, 3, 4, 5, 11, 14, 17]):', quickSort([8, 3, 4, 5, 11, 14, 17]));
