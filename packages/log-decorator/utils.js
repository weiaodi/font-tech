// 模拟转换函数
export function objectHumpToLine(data) {
  return JSON.parse(
    JSON.stringify(data).replace(/"([a-z])([A-Z])"/g, (match, p1, p2) => `"${p1}_${p2.toLowerCase()}"`),
  );
}

export function lineToCamel(data) {
  return JSON.parse(
    JSON.stringify(data).replace(/"([a-z])_([a-z])"/g, (match, p1, p2) => `"${p1}${p2.toUpperCase()}"`),
  );
}

export const subtract = (a, b) => a - b; // 未使用的导出
