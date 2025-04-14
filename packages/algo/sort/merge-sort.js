// 先将数组分割为最小的单元,然后对数组进行排序,后合并为更大的有序数组
// 分开数组和合并数组
const mergeSort = (arr, left = 0, right = arr.length - 1) => {
  // 判断左右数量边界是否超过限制
  if (left >= right) {
    return arr;
  }
  let mid = Math.floor(left + (right - left) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
  return arr;
};
function merge(arr, left, mid, right) {
  // [0,mid] [mid+1,right]
  let temp = [];
  let leftIndex = left,
    rightIndex = mid + 1;
  while (leftIndex <= mid && rightIndex <= right) {
    if (arr[leftIndex] < arr[rightIndex]) {
      // 调整为后自增运算
      temp.push(arr[leftIndex++]);
    } else {
      temp.push(arr[rightIndex++]);
    }
  }
  while (leftIndex <= mid) {
    temp.push(arr[leftIndex++]);
  }
  while (rightIndex <= right) {
    temp.push(arr[rightIndex++]);
  }
  // 先删除指定数量元素在进行修改
  arr.splice(left, right - left + 1, ...temp);
}
const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const res = mergeSort(arr);
console.log('🚀 ~ sortedArrNonOptimized:', res);
