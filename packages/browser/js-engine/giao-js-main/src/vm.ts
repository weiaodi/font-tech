import Visitor from './visitor';
import Interpreter from './interpreter';

const acorn = require('acorn');

const jsInterpreter = new Interpreter(new Visitor());

export function run(code: string) {
  const root = acorn.parse(code, {
    ecmaVersion: 8,
    sourceType: 'script',
  });
  return jsInterpreter.interpret(root);
}
