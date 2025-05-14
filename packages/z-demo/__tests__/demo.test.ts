import { checkNumber, processArray } from '../demo-test';

describe('分支条件测试', () => {
  describe('checkNumber 函数测试', () => {
    test('处理负数', () => {
      expect(checkNumber(-5)).toBe('负数');
    });

    test('处理零', () => {
      expect(checkNumber(0)).toBe('零');
    });

    test('处理偶数', () => {
      expect(checkNumber(4)).toBe('偶数');
    });

    test('处理奇数', () => {
      expect(checkNumber(3)).toBe('奇数');
    });
  });

  describe('processArray 函数测试', () => {
    test('计算大总和', () => {
      expect(processArray([50, 60])).toBe('大总和');
    });

    test('计算小总和', () => {
      expect(processArray([10, 20])).toBe('小总和');
    });

    test('跳过非数字元素', () => {
      expect(processArray([10, 'a', 20])).toBe('小总和');
    });

    test('处理空数组', () => {
      expect(processArray([])).toBe('小总和');
    });

    test('非数组输入抛出错误', () => {
      expect(() => processArray('not an array')).toThrow('输入必须是数组');
    });
  });
});
