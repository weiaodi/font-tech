// 二分插入排序实现
export const binaryInsertionSort = (arr: number[]): number[] => {
  // 复制原数组避免修改输入
  const sortedArr = [...arr];

  // 从第二个元素开始遍历（第一个元素默认已排序）
  for (let i = 1; i < sortedArr.length; i++) {
    const current = sortedArr[i];
    let left = 0;
    let right = i - 1;

    // 二分查找插入位置：找到第一个大于current的元素索引
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedArr[mid] > current) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // 将插入位置后的元素右移一位
    for (let j = i; j > left; j--) {
      sortedArr[j] = sortedArr[j - 1];
    }

    // 插入当前元素到正确位置
    sortedArr[left] = current;
  }

  return sortedArr;
};

// 示例用法
const exampleArray = [5, 2, 9, 1, 5, 6];
console.log('排序前:', exampleArray);
console.log('排序后:', binaryInsertionSort(exampleArray)); // 输出: [1, 2, 5, 5, 6, 9]
