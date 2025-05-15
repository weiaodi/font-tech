function calcImmutable(initialValue = 0) {
  return {
    add(num) {
      return calcImmutable(initialValue + num);
    },
    getValue() {
      return initialValue;
    },
  };
}
function calcMutable(initialValue = 0) {
  let val = initialValue;

  return {
    add(num) {
      val += num;
      return this;
    },
    // 其他方法...
    getValue() {
      return val;
    },
  };
}

class Calculator {
  constructor(initVal = 0) {
    this.val = initVal;
    function add(num) {
      this.val += num;
      return this;
    }
    function getValue() {
      return this.val;
    }
  }
}

function makeCalculator(initVal = 0) {
  return new Calculator(initVal);
}
calcImmutable(10).add(11).getValue();
makeCalculator(10).add(11).getValue();
calcMutable(10).add(11).getValue();
console.log('🚀 ~ calcImmutable(10).add(11).getValue():', calcImmutable(10).add(11).getValue());
