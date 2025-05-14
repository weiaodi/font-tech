// js中 基础类型数值根据值传递 对象类型数值 传递当前对象的引用的副本,具体如下解释
let arr = [1, 2, 3, 4];
function modefyArr(arr) {
  // 改操作拆解下就是 new array
  arr = [123, 123];
  //   修改当前引用副本指向的arr,则所有的引用值都会有所变化
  //   arr.push(1111);
  return arr;
}
console.log('🚀 ~ arr:', arr);

console.log('🚀 ~ modefyArr ~ modefyArr:', modefyArr(arr));
