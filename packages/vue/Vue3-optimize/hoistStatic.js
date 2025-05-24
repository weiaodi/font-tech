const { compile } = require('@vue/compiler-dom');

const template = `
  <div>
    <div>共创1</div>
    <div>共创2</div>
    <div>共创211</div>
    <div>{{ name }}</div>
  </div>
`;

const result = compile(template, {
  mode: 'function',
  hoistStatic: true, // 显式启用静态提升（Vue 3.2+ 默认开启）
  prefixIdentifiers: true, // 启用静态提升
});

console.log(result.code);
