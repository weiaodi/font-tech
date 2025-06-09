// 模拟异步函数 A
function A() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('A 执行完成');
      resolve();
    }, 1000);
  });
}

// 模拟异步函数 B
function B() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('B 执行完成');
      resolve();
    }, 1000);
  });
}

// 模拟异步函数 C
function C() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('C 执行完成');
      resolve();
    }, 1000);
  });
}

// 模拟异步函数 D
function D() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('D 执行完成');
      resolve();
    }, 1000);
  });
}
// 实现：1) 串行执行A,B,C,D 2）并行执行 A,B,C，然后执行D 3）并行执行A,B,C，BC执行完毕后执行D
async function sequenceProcess() {
  await A();
  await B();
  await C();
  await D();
}
async function parallelProcess() {
  await Promise.all([A(), B(), C()]);
  await D();
}
// 并行执行 A, B, C，B 和 C 执行完毕后执行 D
async function parallelABCThenD() {
  // abc并行执行
  const aPromise = A();
  const bcPromise = Promise.all([B(), C()]);

  await bcPromise;
  await D();
  await aPromise;

  console.log('并行执行 A, B, C，B 和 C 执行完毕后执行 D 完毕');
}
