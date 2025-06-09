function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  // FIXME - 该过程中新开辟了两个数组,用来存储,丧失了快排的原地排序优势
  let left = [];
  let right = [];
  //  FIXME - 选取基准值的方式待优化
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
// function quickSort(arr, left = 0, right = arr.length - 1) {
//   if (left < right) {
//     // 在划分操作中已经把基准值放置到正确位置,所以无需再对基准值排序
//     const pivot = partition(arr, left, right);
//     this.quickSort(arr, left, pivot - 1);
//     this.quickSort(arr, pivot + 1, right);
//   }
// }
// function partition(arr, left, right) {
//   let pivot = arr[right];
//   return pivot;
// }
