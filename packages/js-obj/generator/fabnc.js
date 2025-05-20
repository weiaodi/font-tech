function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    // 惰性求职
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}
// 自动调用迭代器来执行
for (let n of fibonacci()) {
  if (n > 1000) {
    break;
  }
  console.log(n);
}
