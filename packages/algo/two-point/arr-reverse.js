function moveElementsInRange(arr, start, end, steps) {
  if (start < 0 || end >= arr.length || start > end) {
    return arr;
  }
  steps %= end - start + 1;

  // 反转指定区域的全部元素
  reverse(arr, start, end);
  // 反转指定区域的前 steps 个元素
  reverse(arr, start, start + steps - 1);
  // 反转指定区域剩余的元素
  reverse(arr, start + steps, end);

  return arr;
}

function reverse(arr, start, end) {
  while (start < end) {
    // 交换元素
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}

// 示例使用
const arr = [1, 2, 3, 4, 5, 6, 7];
const start = 2;
const end = 5;
const steps = 2;
const result = moveElementsInRange(arr, start, end, steps);
console.log(result);
