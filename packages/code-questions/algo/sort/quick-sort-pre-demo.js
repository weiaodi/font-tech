// 思路:找寻基准值,对数组进行排序,然后把基准值放在正确位置,递归进行调用,同时判断左右两侧数组长度, 优先处理最短的数组

function partition(arr, left, right) {
  let pivot = arr[right];
  let sortedIndex = left - 1;
  for (let unsortedIndex = left; unsortedIndex < right; unsortedIndex++) {
    if (arr[unsortedIndex] < pivot) {
      sortedIndex++;
      [arr[sortedIndex], arr[unsortedIndex]] = [arr[unsortedIndex], arr[sortedIndex]];
    }
  }
  //   将基准值移动到正确的位置
  [arr[sortedIndex + 1], arr[right]] = [arr[right], arr[sortedIndex + 1]];
  return sortedIndex + 1;
}
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    let pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}
// 优先递归最短的数组
function quickSortOptimized(arr, left = 0, right = arr.length - 1) {
  while (left < right) {
    let pivotIndex = partition(arr, left, right);
    if (pivotIndex - left < right - pivotIndex) {
      quickSortOptimized(arr, left, pivotIndex - 1);
      // 剩余待处理的数组区间是 [pivotindex+1 ,right]
      left = pivotIndex + 1;
    } else {
      quickSortOptimized(arr, pivotIndex + 1, right);
      right = pivotIndex - 1;
    }
  }
  return arr;
}
quickSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]);
console.log(
  '🚀 ~ quickSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]):',
  quickSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]),
  quickSortOptimized([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]),
);

function quickSort1(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let left = [],
    right = [],
    pivot = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    }
    if (arr[i] > pivot) {
      right.push(arr[i]);
    }
  }
  return [...quickSort1(left), pivot, ...quickSort1(right)];
}
