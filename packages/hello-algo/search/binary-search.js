// import { k6Report } from '@wei-demo/k6-tools';

/**
 * @name 二分搜索思路:先确定左右区间(推荐使用双闭合区间),然后找寻中间数值,不断的收缩左/右边界
 * @pros
    二分查找的时间效率高。在大数据量下，对数阶的时间复杂度具有显著优势。
    二分查找无须额外空间。相较于需要借助额外空间的搜索算法（例如哈希查找），二分查找更加节省空间。
 * @cons
    二分查找仅适用于有序数据
    二分查找仅适用于数组。二分查找需要跳跃式（非连续地）访问元素，而在链表中执行跳跃式访问的效率较低，因此不适合应用在链表或基于链表实现的数据结构
    小数据量下，线性查找性能更佳。在线性查找中，每轮只需 1 次判断操作；而在二分查找中，需要 1 次加法、1 次除法、1 ~ 3 次判断操作、1 次加法（减法），共 4 ~ 6 个单元操作；因此，当数据量 
 较小时，线性查找反而比二分查找更快
 *
 *
 * @param {*} arr
 * @param {*} target
 * @return {*}
 */
function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
  arr = []
  target = 1
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2)
    if (arr[mid] === target) {
      return mid
    }
    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}
binarySearch([1], 1)
