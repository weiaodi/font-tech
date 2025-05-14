export function checkNumber(num: number) {
  if (num < 0) {
    return '负数';
  }
  if (num === 0) {
    return '零';
  }
  if (num % 2 === 0) {
    return '偶数';
  }
  return '奇数';
}

export function processArray(arr: string | (string | number)[]) {
  if (!Array.isArray(arr)) {
    throw new Error('输入必须是数组');
  }

  let sum = 0;
  for (const num of arr) {
    if (typeof num !== 'number') {
      continue;
    }
    sum += num;
  }

  return sum > 100 ? '大总和' : '小总和';
}
