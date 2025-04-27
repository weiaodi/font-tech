class _HardMan {
  constructor(name) {
    this.tasks = [];
    // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个函数，主要是考虑了restFirst的情况
    setTimeout(async () => {
      for (let task of this.tasks) {
        await task();
      }
    });
    this.tasks.push(
      () =>
        new Promise((resolve) => {
          console.log(`I am ${name}`);
          resolve();
        }),
    );
  }

  wait(sec) {
    return new Promise((resolve) => {
      console.log(`//等待${sec}秒..`);
      setTimeout(() => {
        console.log(`Start learning after ${sec} seconds`);
        resolve();
      }, sec * 1000);
    });
  }

  rest(sec) {
    this.tasks.push(() => this.wait(sec));
    return this;
  }

  restFirst(sec) {
    this.tasks.unshift(() => this.wait(sec));
    return this;
  }

  learn(params) {
    this.tasks.push(
      () =>
        new Promise((resolve) => {
          console.log(`Learning ${params}`);
          resolve();
        }),
    );
    return this;
  }
}

const HardMan = function (name) {
  return new _HardMan(name);
};

// HardMan('jack');
// // I am jack

HardMan('jack').rest(1).learn('computer');
// I am jack
// 等待10秒
// Start learning after 10 seconds
// Learning computer

// HardMan('jack').restFirst(5).learn('chinese');
// // 等待5秒
// // Start learning after 5 seconds
// // I am jack
// // Learning chinese
