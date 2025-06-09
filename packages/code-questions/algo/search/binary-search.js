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
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) {
      // 提前返回但是不能确认当前元素就是一个个出现的目标元素
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
function binarySearch1(arr, target) {
  // 左闭右开
  let left = 0;
  let right = arr.length;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  if (left === arr.length) {
    return -1;
  }
  return left;
}
// 如果确定目标值存在于数组中，可以使用双指针夹逼法，在找到任意匹配位置后快速向左右扩展：
function binarySearch2(arr, target) {
  let left = 0;
  let right = arr.length - 1; // 注意这里改为闭区间

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      // 找到任意匹配后，向左扩展到第一个出现的位置
      while (mid > 0 && arr[mid - 1] === target) {
        mid--;
      }
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
binarySearch([1, 2, 3, 4, 5], 1);
console.log('🚀 ~ binarySearch([1, 2, 3, 4, 5], 1):', binarySearch1([1, 2, 3, 4, 5], 4));
