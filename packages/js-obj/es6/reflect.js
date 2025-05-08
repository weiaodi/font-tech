const book = {
  title: 'JavaScript Guide',
  author: 'John Doe',
  year: 2024,
};
delete book.author;
// 删除 year 属性
Reflect.deleteProperty(book, 'year');
console.log(book);
