let a = 'hi, my name is {name}, I am {age} years old, my email is {email}.';
let b = { name: 'max', age: 12, email: 'max@gmail.com' };
// 实现这个方法
function replace(tpl, data) {
  return tpl.replace(/\{(?<key>[^{}]+)\}/g, (match, _, offset, string, groups) => {
    // 参数解析：
    // match: 整个匹配的字符串（如 "{name}"）
    // _: 未使用的参数（通常是第一个捕获组的内容，但这里用命名捕获组替代了）
    // offset: 匹配在原字符串中的位置（如 10）
    // string: 原始字符串本身
    // groups: 命名捕获组对象（如 { key: "name" }）
    return data[groups.key] || match;
  });
}

function replace1(tpl, data) {
  return tpl.replace(/\{([^{}]+)\}/g, (match, _) => {
    return data[_] || match;
  });
}
function replace2(tpl, data) {
  let regex = /\{([^{}]+)\}/g;
  let lastIndex = 0;
  let res = '';
  let match = null;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(tpl)) !== null) {
    let curIndex = match.index;
    let key = match[1];
    res += tpl.slice(lastIndex, curIndex);
    res += data[key] !== undefined ? data[key] : match[0];
    lastIndex = regex.lastIndex;
  }

  res += tpl.slice(lastIndex);
  return res;
}
console.log('🚀 ~ replace ~ replace:', replace2(a, b));
