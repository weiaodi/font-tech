const pipeLine =
  (...funs) =>
  (initialValue) =>
    funs.reduce((preFn, curFn) => curFn(preFn), initialValue);
const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;
let demoPipe = pipeLine(plus1, mult2);
demoPipe(11);
