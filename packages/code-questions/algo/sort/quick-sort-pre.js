// 思路:找寻基准值,对数组进行排序,然后把基准值放在正确位置,递归进行调用,同时判断左右两侧数组长度,交替递归最短的
/* 
尾递归优化情况下的快排
                 [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
                  
                    [3, 1, 4, 1, 2, 3] 5 [6, 5, 9, 5]
          
                                               |
                                        [6, 5, 9, 5] (右子数组较短，先递归处理)
                                        /        \
                                        [5]        [6, 9, 5]
                                                    |
                                                [6, 9]
                                                /    \
                                            [6]    [9]
                                       |
                              [3, 1, 4, 1, 2, 3] 
                               /                 \
                            [1, 1, 2]           [3, 4, 3]
                           /        \           /       \
                        [1]        [1, 2]     [3]       [4, 3]
                                   /    \               /    \
                                [1]    [2]           [3]    [4] 
 */
// 分区函数
function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 非尾递归优化的快速排序
function quickSortNonOptimized(arr, left = 0, right = arr.length - 1, depth = 0) {
  console.log(` 当前深度: ${depth},
        处理区间: [${left}, ${right}],
        数组: [${arr.slice(left, right + 1)}]
        原数组[${arr}]
     `);
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSortNonOptimized(arr, left, pivotIndex - 1, depth + 1);
    quickSortNonOptimized(arr, pivotIndex + 1, right, depth + 1);
  }
  return arr;
}

// 尾递归优化的快速排序
function quickSortOptimized(arr, left = 0, right = arr.length - 1, depth = 0) {
  while (left < right) {
    const pivot = partition(arr, left, right);
    console.log(` 当前深度: ${depth}, 
        处理区间: [${left}, ${right}], 
        数组: [${arr.slice(left, right + 1)}]
        原数组[${arr}]
        基准值[${arr[pivot]}]`);
    if (pivot - left < right - pivot) {
      3;
      quickSortOptimized(arr, left, pivot - 1, depth + 1);
      left = pivot + 1; // 待处理的区域是[pivot+1,right]
    } else {
      quickSortOptimized(arr, pivot + 1, right, depth + 1);
      right = pivot - 1;
    }
  }
  return arr;
}

const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log('非尾递归优化快速排序过程：');
const sortedArrNonOptimized = quickSortNonOptimized([...arr]);
console.log('非尾递归优化排序结果:', sortedArrNonOptimized);

console.log('\n尾递归优化快速排序过程：');
const sortedArrOptimized = quickSortOptimized([...arr]);
console.log('尾递归优化排序结果:', sortedArrOptimized);
