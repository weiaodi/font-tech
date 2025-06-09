import { log } from 'log-decorator';

class Calculator {
  @log
  add(a, b) {
    return a + b;
  }
}

const calculator = new Calculator();
calculator.add(1, 2);
