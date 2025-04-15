const parser = require('@babel/parser');
const generator = require('@babel/generator').default;

const code = 'const num = 10 + 5;';
const ast = parser.parse(code);
console.log('🚀 ~ ast:', ast);
const { code: generatedCode } = generator(ast);
console.log(generatedCode);
