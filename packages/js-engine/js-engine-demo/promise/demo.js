/*
有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个 await 放在 try...catch 结构里面，这样不管这个异步操作是否成功，第二个 await 都会执行。
 */
async function foo() {
  try {
    // eslint-disable-next-line prefer-promise-reject-errors
    await Promise.reject('Error!');
  } catch (err) {
    // do something
  }

  return await Promise.resolve('Hello world!');
}

foo().then((res) => console.log(res));
// 'Hello world!'
/*
async function foo() {
    await Promise.reject('Error!').catch((e) => console.log(e));
  
    return await Promise.resolve('Hello world!');
  }
  
  foo().then((res) => console.log(res));
  'Error!'
  'Hello world!'
*/
