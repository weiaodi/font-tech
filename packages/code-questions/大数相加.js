function addLargeNumbers(num1, num2) {
  // 转换为字符串并去除前导零
  num1 = String(num1).replace(/^0+/, '') || '0';
  num2 = String(num2).replace(/^0+/, '') || '0';

  let result = '';
  let carry = 0; // 进位
  let i = num1.length - 1;
  let j = num2.length - 1;

  // 从右到左逐位相加
  while (i >= 0 || j >= 0 || carry > 0) {
    const digit1 = i >= 0 ? parseInt(num1[i]) : 0;
    const digit2 = j >= 0 ? parseInt(num2[j]) : 0;

    // 当前位的和（包含进位）
    const sum = digit1 + digit2 + carry;
    carry = Math.floor(sum / 10); // 计算新的进位
    result = (sum % 10) + result; // 将当前位结果添加到结果字符串前面

    i--;
    j--;
  }

  return result;
}

// 示例
console.log(addLargeNumbers('12312313', '13123')); // 输出: "12325436"
console.log(addLargeNumbers('999', '1')); // 输出: "1000"
console.log(addLargeNumbers('00123', '456')); // 输出: "579"
console.log(addLargeNumbers(12345, 67890)); // 输出: "80235"
