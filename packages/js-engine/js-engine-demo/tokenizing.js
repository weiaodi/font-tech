function tokenize(code) {
  const tokens = [];
  let current = 0;

  while (current < code.length) {
    let char = code[current];

    if (char === ' ') {
      current++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let value = '';
      while (/[a-zA-Z]/.test(char) && current < code.length) {
        value += char;
        char = code[++current];
      }
      tokens.push({ type: 'identifier', value });
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = '';
      while (/[0-9]/.test(char) && current < code.length) {
        value += char;
        char = code[++current];
      }
      tokens.push({ type: 'number', value });
      continue;
    }

    if (char === '=') {
      tokens.push({ type: 'operator', value: '=' });
      current++;
      continue;
    }

    if (char === '+') {
      tokens.push({ type: 'operator', value: '+' });
      current++;
      continue;
    }

    if (char === ';') {
      tokens.push({ type: 'punctuation', value: ';' });
      current++;
      continue;
    }

    throw new TypeError(`Unexpected character: ${char}`);
  }

  return tokens;
}

const code = 'const num = 10 + 5;';
const tokens = tokenize(code);
console.log(tokens);
