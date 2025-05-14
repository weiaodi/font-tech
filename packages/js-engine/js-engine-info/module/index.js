const main = document.querySelector('main');
let someVariable = 1;
import(`./section-modules/${someVariable}.js`)
  .then((module) => {
    module.loadPageInto(main);
  })
  .catch((err) => {
    main.textContent = err.message;
  });
// 并发加载多个模块
Promise.all([import('./module1.js'), import('./module2.js'), import('./module3.js')]).then(
  ([module1, module2, module3]) => {
    // do something
  },
);

// 在异步函数中加载
async function main1() {
  const module = await import('./module.js');

  const { export1, export2 } = await import('./module.js');

  const [module1, module2, module3] = await Promise.all([
    import('./module1.js'),
    import('./module2.js'),
    import('./module3.js'),
  ]);
}

main1();
