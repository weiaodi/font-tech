function logMatrix(input) {
  if (input.length === 0 || input[0].length === 0) {
    return [];
  }
  const rows = input.length;
  const cols = input[0].length;
  let res = [];
  let row = 0,
    col = 0;
  let goingUp = true; // 标记当前方向，true 表示右上方向，false 表示左下方向

  while (res.length < rows * cols) {
    res.push(input[row][col]);

    if (goingUp) {
      if (row === 0 && col < cols - 1) {
        // 到达上边界，且未到右边界，向右移动并改变方向
        col++;
        goingUp = false;
      } else if (col === cols - 1) {
        // 到达右边界，向下移动并改变方向
        row++;
        goingUp = false;
      } else {
        // 正常右上移动
        row--;
        col++;
      }
    } else if (col === 0 && row < rows - 1) {
      // 到达左边界，且未到下边界，向下移动并改变方向
      row++;
      goingUp = true;
    } else if (row === rows - 1) {
      // 到达下边界，向右移动并改变方向
      col++;
      goingUp = true;
    } else {
      // 正常左下移动
      row++;
      col--;
    }
  }

  return res;
}

const input = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];

console.log(logMatrix(input));
