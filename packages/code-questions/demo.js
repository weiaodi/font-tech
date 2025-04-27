class _HardMan {
  constructor(name) {
    this.queue = [
      () =>
        new Promise((resolve) => {
          console.log(`I am ${name} `);
          resolve();
        }),
    ];
    setTimeout(async () => {
      for (const fn of this.queue) {
        await fn();
      }
    }, 0);
  }
  rest(time) {
    this.queue.push(
      () =>
        new Promise((resolve) => {
          console.log(`//等待${time}秒..`);
          setTimeout(() => {
            console.log(`Start learning after ${time} seconds`);
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
          console.log(`//等待${time}秒..`);
          setTimeout(() => {
            console.log(`Start learning after ${time} seconds`);
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
          console.log(`Learning ${subject} `);
          resolve();
        }),
    );
    return this;
  }
}

function HardMan(name) {
  return new _HardMan(name);
}

// HardMan('jack');
// // I am jack

HardMan('jack').rest(1).learn('computer');
// I am jack
// Start learning after 10 seconds
//  computer

// HardMan('jack').restFirst(1).learn('chinese');
// // 等待5秒
// // Start learning after 5 seconds
// // I am jack
// // Learning chinese
