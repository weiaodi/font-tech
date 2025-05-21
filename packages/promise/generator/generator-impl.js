function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i) {
  yield* anotherGenerator(i);
}

let gen = generator(1);

gen.next().value; // 2
gen.next().value; // 3
gen.next().value; // 4
