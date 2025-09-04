/**
 * 双掩码修改操作
 * 核心: setSlots(设置掩码) + clearSlots(清除掩码) 记录属性变更
 */

// 属性常量定义
// eslint-disable-next-line max-classes-per-file
const Prop = {
  VALUE: 1 << 0, // 1 (0001)
  FORMULA: 1 << 1, // 2 (0010)
  FORMAT: 1 << 2, // 4 (0100)
};

/**
 * 修改操作
 * - setSlots: 记录被设置的属性(位掩码)
 * - clearSlots: 记录被清除的属性(位掩码)
 * - 动态添加的已设置属性值
 */
class Delta {
  constructor() {
    this.setSlots = 0; // 设置掩码
    this.clearSlots = 0; // 清除掩码
  }
}

/**
 * 用双掩码记录属性的设置/清除状态
 */
class DeltaBuilder {
  constructor() {
    this.delta = new Delta();
  }

  // 设置属性: 更新设置掩码, 清除对应清除掩码, 存储属性值
  set(prop, key, value) {
    this.delta.setSlots |= prop; // 设置掩码标记
    this.delta.clearSlots &= ~prop; // 清除掩码清除
    this.delta[key] = value; // 存储属性值
    return this;
  }

  // 清除属性: 更新清除掩码, 清除对应设置掩码, 删除属性值
  clear(prop, key) {
    this.delta.clearSlots |= prop; // 清除掩码标记
    this.delta.setSlots &= ~prop; // 设置掩码清除
    delete this.delta[key]; // 删除属性值
    return this;
  }

  // 构建最终增量对象
  build() {
    return this.delta;
  }
}

// --------------------------
// 使用示例
// --------------------------

// 创建构建器
const builder = new DeltaBuilder();

// 构建增量: 设置值, 设置公式, 清除格式
builder
  .set(Prop.VALUE, 'value', 100) // 设置值属性
  .clear(Prop.FORMAT, 'format'); // 清除格式属性

// 生成增量对象
const delta = builder.build();

// 输出结果
console.log('增量对象:', delta);
/* 输出:
{
  setSlots: 3,          // 0011 (VALUE+FORMULA被设置)
  value: 100,           // 仅存储已设置的属性值
  clearSlots: 4
}
*/
