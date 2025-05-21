function* generator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

let gen = generator(1);

gen.next().value; // 2

gen.next().value; // 3
gen.next().value; // 4
