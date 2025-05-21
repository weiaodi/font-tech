function muYouAsync(gen) {}

const getFetch = (nums) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(nums + 1);
    }, 1000);
  });

function* gen() {
  let res1 = yield getFetch(1);
  let res2 = yield getFetch(res1);
  let res3 = yield getFetch(res2);
  return res3;
}

const asyncGen = muYouAsync(gen);
asyncGen().then((res) => {
  console.log(res);
}); // 4
