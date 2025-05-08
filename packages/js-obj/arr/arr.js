// 展示查找相关方法的使用
function showSearchMethods() {
  let ages = [32, 33, 116, 40, 1];
  let fruits3 = ['Banana', 'Orange', 'Apple', 'Mango'];

  // find 方法：
  // 功能：返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
  // 参数：一个回调函数，该回调函数接受当前元素、当前元素的索引和数组本身作为参数。
  // 示例：查找数组中值为 32 的第一个元素
  let i = ages.find((item) => item === 32);
  console.log('查找方法 - find：找到值为 32 的元素，结果', i);

  // findIndex 方法：
  // 功能：返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。
  // 参数：一个回调函数，该回调函数接受当前元素、当前元素的索引和数组本身作为参数。
  // 示例：查找数组中值为 32 的第一个元素的索引
  let i1 = ages.findIndex((item) => item === 32);
  console.log('查找方法 - findIndex：找到值为 32 的元素的索引，结果', i1);

  // indexOf 方法：
  // 功能：返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回 -1。
  // 参数：要查找的元素和可选的开始查找的索引位置。
  // 示例：查找值为 116 的元素的索引
  let i3 = ages.indexOf(116);
  console.log('查找方法 - indexOf：找到值为 116 的元素的索引，结果', i3);

  // includes 方法：
  // 功能：用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。
  // 参数：需要查找的元素和可选的开始查找的索引位置。
  // 示例：判断数组是否包含 2
  let includesResult = [1, 2, 3].includes(2);
  console.log('查找方法 - includes：判断数组是否包含 2，结果', includesResult);

  // entries 方法：
  // 功能：返回一个新的 Array Iterator 对象，该对象包含数组中每个索引的键/值对。
  // 参数：无。
  // 示例：返回一个数组迭代器对象，包含数组的键值对
  let a = fruits3.entries();
  console.log('查找方法 - entries：返回的迭代器对象', a);
}

// 展示增加相关方法的使用
function showAdditionMethods() {
  let listSplice = ['a'];

  // splice 方法：
  // 功能：通过删除或替换现有元素或者原地添加新的元素来修改数组，并以数组形式返回被修改的内容。此方法会改变原数组。
  // 参数：开始修改的索引位置、要删除的元素个数（可选）和要插入的元素（可选）。
  // 示例：在索引 0 位置插入 'b' 和 'c'
  listSplice.splice(0, 0, 'b', 'c');
  console.log('增加方法 - splice：第一次插入后的数组', listSplice);

  // 示例：在索引 1 位置插入 'b' 和 'c'
  listSplice.splice(1, 0, 'b', 'c');
  console.log('增加方法 - splice：第二次插入后的数组', listSplice);
}

// 展示删除和替换相关方法的使用
function showRemovalAndReplacementMethods() {
  let listSplice = ['a', 'b', 'c'];

  // splice 方法：
  // 功能：通过删除或替换现有元素或者原地添加新的元素来修改数组，并以数组形式返回被修改的内容。此方法会改变原数组。
  // 参数：开始修改的索引位置、要删除的元素个数（可选）和要插入的元素（可选）。
  // 示例：从索引 1 位置删除 1 个元素，并插入 'bbbb' 和 'cccc'
  listSplice.splice(1, 1, 'bbbb', 'cccc');
  console.log('删除和替换方法 - splice：替换后的数组', listSplice);

  let fruits = ['Banana', 'Orange', 'Apple', 'Mango'];

  // copyWithin 方法：
  // 功能：浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。
  // 参数：复制到的目标索引位置、开始复制的起始索引位置（可选，默认为 0）和结束复制的结束索引位置（可选，默认为数组长度）。
  // 示例：从索引 1 开始，复制从倒数第 4 个元素开始的所有元素到索引 1 位置
  fruits.copyWithin(1, -4);
  console.log('删除和替换方法 - copyWithin：第一种复制方式结果', fruits);

  let fruits1 = ['Banana', 'Orange', 'Apple', 'Mango'];

  // 示例：从索引 2 开始，复制索引 1 到 3（不包含 3）的元素到索引 2 位置
  fruits1.copyWithin(2, 1, 3);
  console.log('删除和替换方法 - copyWithin：第二种复制方式结果', fruits1);
}
showRemovalAndReplacementMethods();
// 展示转换相关方法的使用
function showConversionMethods() {
  let fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
  let nestedArray = [1, [2, [3, 4]]];
  let arr = [1, 2, [3, 4]];
  const str = 'hello';

  // join 方法：
  // 功能：将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。
  // 参数：用于分隔数组元素的字符串（可选，默认为逗号）。
  // 示例：使用 " a " 连接数组元素
  let energy = fruits.join(' a ');
  console.log('转换方法 - join：连接后的字符串', energy);

  // flat 方法：
  // 功能：会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
  // 参数：指定要扁平化的深度（可选，默认为 1）。
  // 示例：扁平化数组，深度为 1
  const flattenedArray = nestedArray.flat(1);
  console.log('转换方法 - flat：扁平化深度为 1 的结果', flattenedArray);

  // flatMap 方法：
  // 功能：首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 连着深度值为 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。
  // 参数：一个回调函数，该回调函数接受当前元素、当前元素的索引和数组本身作为参数。
  // 示例：使用 flatMap 进行映射和一层扁平化
  const flattened = arr.flatMap((item) => (Array.isArray(item) ? item : [item]));
  console.log('转换方法 - flatMap：映射并扁平化后的结果', flattened);

  // Array.from 方法：
  // 功能：从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
  // 参数：类似数组或可迭代对象和可选的映射函数。
  // 示例：将字符串转换为数组
  const strArray = Array.from(str);
  console.log('转换方法 - Array.from：将字符串转换为数组，结果', strArray);

  // Array.isArray 方法：
  // 功能：用于确定传递的值是否是一个 Array。
  // 参数：需要检查的值。
  // 示例：判断 fruits 是否为数组
  let isArray = Array.isArray(fruits);
  console.log('转换方法 - Array.isArray：判断是否为数组，结果', isArray);
}

// 展示排序和判断相关方法的使用
function showSortingAndJudgmentMethods() {
  let ages = [32, 33, 116, 40, 1];
  let list = [32, 33, 116, 40, 1];

  // every 方法：
  // 功能：测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
  // 参数：一个回调函数，该回调函数接受当前元素、当前元素的索引和数组本身作为参数。
  // 示例：判断数组中所有元素是否都大于 18
  let everyResult = ages.every((v) => v > 18);
  console.log('排序和判断方法 - every：判断所有元素是否都大于 18，结果', everyResult);

  // filter 方法：
  // 功能：创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
  // 参数：一个回调函数，该回调函数接受当前元素、当前元素的索引和数组本身作为参数。
  // 示例：过滤出数组中大于 18 的元素
  let filterResult = ages.filter((v) => v > 18);
  console.log('排序和判断方法 - filter：过滤出大于 18 的元素，结果', filterResult);

  // some 方法：
  // 功能：测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个布尔值。
  // 参数：一个回调函数，该回调函数接受当前元素、当前元素的索引和数组本身作为参数。
  // 示例：判断数组中是否有元素大于 118
  let someResult = ages.some((v) => v > 118);
  console.log('排序和判断方法 - some：判断是否有元素大于 118，结果', someResult);

  // sort 方法：
  // 功能：对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 UTF-16 代码单元值序列时构建的。
  // 参数：可选的比较函数，用于定义排序规则。
  // 示例：对数组进行升序排序
  list.sort((a, b) => a - b);
  console.log('排序和判断方法 - sort：升序排序后的数组', list);
}

// 展示其他方法的使用
function showOtherMethods() {
  // fill 方法：
  // 功能：用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。
  // 参数：用来填充数组元素的值、开始填充的索引位置（可选，默认为 0）和结束填充的索引位置（可选，默认为数组长度）。
  // 示例：创建一个长度为 10 的数组，并用 'a' 填充
  const demo = new Array(10).fill('a');
  console.log('其他方法 - fill：填充后的数组', demo);

  const sites = ['Google', 'Baidu', 'Runoob', 'Taobao'];

  // with 方法：
  // 功能：ES2023 引入，返回一个新数组，其中指定索引处的值已被替换为给定值，而不改变原始数组。
  // 参数：要替换的元素的索引位置和新的值。
  // 示例：安全更新数组中索引为 1 的元素
  const site = sites.with(1, 'JYSHARE');
  console.log('其他方法 - with：更新后的数组', site);

  let fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
  let fruits1 = ['Banana', 'Orange', 'Apple', 'Mango'];

  // concat 方法：
  // 功能：用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
  // 参数：需要合并的数组或值。
  // 示例：拼接两个数组，但这里没有将结果赋值给变量，原数组 fruits 不变
  fruits.concat(fruits1);

  // reverse 方法：
  // 功能：将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。
  // 参数：无。
  // 示例：反转数组元素顺序
  fruits.reverse();

  // slice 方法：
  // 功能：返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括 end）。原始数组不会被改变。
  // 参数：开始提取的索引位置和结束提取的索引位置（可选，默认为数组长度）。
  // 示例：截取数组中索引 1 到 3（不包含 3）的元素
  let citrus = fruits.slice(1, 3);
  console.log('其他方法 - concat、reverse、slice：反转后的数组', fruits);
  console.log('其他方法 - concat、reverse、slice：截取的数组', citrus);
}

// 调用所有展示方法
// showSearchMethods();
// showAdditionMethods();
// showRemovalAndReplacementMethods();
// showConversionMethods();
// showSortingAndJudgmentMethods();
// showOtherMethods();

// const set = new Set([1, 2, 3]);
// set.forEach((value) => {
//   console.log(value);
//   if (value === 2) {
//     set.delete(2);
//     set.add(2);
//   }
// });

// const originalSet = new Set([1, 2, 3]);
// const newSet = new Set(originalSet);

// newSet.forEach((value) => {
//   console.log(value);
//   if (value === 2) {
//     originalSet.delete(2);
//     originalSet.add(2);
//   }
// });
