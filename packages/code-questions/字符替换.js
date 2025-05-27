let a = 'hi, my name is {name}, I am {age} years old, my email is {email}.';
let b = { name: 'max', age: 12, email: 'max@gmail.com' };
// 实现这个方法
function replace(tpl, data) {
  return tpl.replace(/\{([^{}]+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

function replace1(tpl, data) {
  const regex = /\{([^{}]+)\}/g;
  let result = '';
  let lastIndex = 0;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(tpl)) !== null) {
    const key = match[1];
    // 添加匹配前的文本
    result += tpl.slice(lastIndex, match.index);
    // 添加替换值或原始匹配
    result += data[key] !== undefined ? data[key] : match[0];
    // 更新 lastIndex 到当前匹配结束位置
    lastIndex = regex.lastIndex;
  }

  // 添加最后一个匹配后的剩余文本
  result += tpl.slice(lastIndex);

  return result;
}
console.log('🚀 ~ replace(a, b):', replace(a, b), replace1(a, b));
