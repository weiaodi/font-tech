/** 自动生成：文件夹结构+TS文件内容映射（Vite打包时生成） */
export const filesMap = {
  api: {
    order:
      "// 二分插入排序实现\\nexport const binaryInsertionSort = (arr: number[]): number[] => {\\n  // 复制原数组避免修改输入\\n  const sortedArr = [...arr];\\n\\n  // 从第二个元素开始遍历（第一个元素默认已排序）\\n  for (let i = 1; i < sortedArr.length; i++) {\\n    const current = sortedArr[i];\\n    let left = 0;\\n    let right = i - 1;\\n\\n    // 二分查找插入位置：找到第一个大于current的元素索引\\n    while (left <= right) {\\n      const mid = Math.floor((left + right) / 2);\\n      if (sortedArr[mid] > current) {\\n        right = mid - 1;\\n      } else {\\n        left = mid + 1;\\n      }\\n    }\\n\\n    // 将插入位置后的元素右移一位\\n    for (let j = i; j > left; j--) {\\n      sortedArr[j] = sortedArr[j - 1];\\n    }\\n\\n    // 插入当前元素到正确位置\\n    sortedArr[left] = current;\\n  }\\n\\n  return sortedArr;\\n};\\n\\n// 示例用法\\nconst exampleArray = [5, 2, 9, 1, 5, 6];\\nconsole.log(\\'排序前:\\', exampleArray);\\nconsole.log(\\'排序后:\\', binaryInsertionSort(exampleArray)); // 输出: [1, 2, 5, 5, 6, 9]\\n",
    user: 'export const getUser = () => ({ id: 1 });\\n',
  },
  utils: {
    format: 'export const format = (s: string) => s.trim();\\n',
  },
} as const;
export type FilesMap = typeof filesMap;
