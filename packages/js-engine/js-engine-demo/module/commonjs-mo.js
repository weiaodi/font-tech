let count = 0;

function increment() {
  count++;
  console.log('内部 count:', count);
}

// 导出时拷贝 count 的初始值（0）
module.exports = {
  count, // 拷贝值（0）
  increment, // 导出函数引用
  getCount() {
    // 通过方法获取实时值
    return count;
  },
};
