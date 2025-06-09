function bucketSort(nums) {
  if (nums.length === 0) return nums;
  // 需要先得知数据中的最大最小输入范围
  const minVal = Math.min(...nums);
  const maxVal = Math.max(...nums);
  const range = maxVal - minVal;

  if (range === 0) return nums;

  const k = nums.length;
  const buckets = Array.from({ length: k }, () => []);

  for (const num of nums) {
    const i = Math.floor(((num - minVal) / range) * (k - 1));
    buckets[i].push(num);
  }

  let sortedIndex = 0;
  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
    for (const num of bucket) {
      nums[sortedIndex++] = num;
    }
  }

  return nums;
}

// 测试用例
const testCases = [
  { input: [0.2, 0.7, 0.1, 0.9, 0.5], expected: [0.1, 0.2, 0.5, 0.7, 0.9] },
  { input: [-5, 3, 7, 2, -1], expected: [-5, -1, 2, 3, 7] },
  { input: [100, 200, 150, 300, 250], expected: [100, 150, 200, 250, 300] },
  { input: [0.5, 2.3, -1.7, 3.2, 0], expected: [-1.7, 0, 0.5, 2.3, 3.2] },
  { input: [], expected: [] },
  { input: [5], expected: [5] },
  { input: [2, 2, 2, 2], expected: [2, 2, 2, 2] },
];

// 执行测试
testCases.forEach((testCase, index) => {
  const input = [...testCase.input]; // 复制输入数据
  const result = bucketSort(input);
  const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.expected);

  console.log(`测试用例 ${index + 1}:`, isCorrect ? '✅ 通过' : '❌ 失败');
  console.log('  输入:', testCase.input);
  console.log('  预期:', testCase.expected);
  console.log('  实际:', result);
  console.log('');
});
