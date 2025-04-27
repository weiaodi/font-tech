/* eslint-disable */
// 选择披萨
async function selectPizza() {
  // 异步获取披萨数据
  const pizzaData = await getPizzaData();
  // 选择披萨
  const chosenPizza = choosePizza();
  // 异步添加选中披萨到购物车
  await addPizzaToCart(chosenPizza);
}

// 选择饮料
async function selectDrink() {
  // 异步获取饮料数据
  const drinkData = await getDrinkData();
  // 选择饮料
  const chosenDrink = chooseDrink();
  // 异步添加选中饮料到购物车
  await addDrinkToCart(chosenDrink);
}

(async () => {
  // 并发执行这些非阻塞异步函数
  Promise.all([selectPizza(), selectDrink()]).then(orderItems);
})();
