class _HardMan {
  constructor(name) {
    this.queue = [
      () =>
        new Promise((resolve) => {
          console.log(`I am${name}`);
          resolve();
        }),
    ];
  }
  rest(time) {
    this.queue.push(
      () =>
        new Promise((resolve) => {
          console.log(`等待${time}秒`);
          setTimeout(() => {
            console.log(`Start learning after${time}seconds`);
            resolve();
          }, time * 1000);
        }),
    );
    return this;
  }
  restFirst(time) {
    this.queue.unshift(
      () =>
        new Promise((resolve) => {
          console.log(`等待${time}秒`);
          setTimeout(() => {
            console.log(`Start learning after${time}seconds`);
            resolve();
          }, time * 1000);
        }),
    );
    return this;
  }
  learn(subject) {
    this.queue.push(
      () =>
        new Promise((resolve) => {
          console.log(`Learning${subject}`);
          resolve();
        }),
    );
    return this;
  }
  excute() {
    setTimeout(async () => {
      for (const fn of this.queue) {
        await fn();
      }
    });
    return this;
  }
}

function HardMan(params) {
  return new _HardMan(params).excute();
}

HardMan('jack');
// I am jack

HardMan('jack').rest(1).learn('computer');
// I am jack
// 等待10秒
// Start learning after 10 seconds
// Learning computer

// HardMan('jack').restFirst(5).learn('chinese');
// 等待5秒
// Start learning after 5 seconds
// I am jack
// Learning chinese
