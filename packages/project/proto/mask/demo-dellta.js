/* eslint-disable */
/**
 * 完整的单元格增量系统
 * 包含属性定义、数据存储对象和构建器
 */
var __assign =
  (this && this.__assign)
  || function () {
    __assign =
      Object.assign
      || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (let p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
// 定义单元格支持的属性（槽位）
let CellProperty;
(function (CellProperty) {
  CellProperty[(CellProperty.VALUE = 1)] = 'VALUE';
  CellProperty[(CellProperty.FORMULA = 2)] = 'FORMULA';
  CellProperty[(CellProperty.FORMAT = 4)] = 'FORMAT';
  CellProperty[(CellProperty.VALIDATION = 8)] = 'VALIDATION';
  CellProperty[(CellProperty.COMMENT = 16)] = 'COMMENT';
  CellProperty[(CellProperty.LINK = 32)] = 'LINK';
})(CellProperty || (CellProperty = {}));
/**
 * 单元格增量对象，存储实际的属性变化
 * 包含属性的设置和清除方法，遵循链式调用风格
 */
let CellDelta = /** @class */ (function () {
  function CellDelta() {
    this.setProperties = 0; // 记录被设置的属性掩码
    this.clearProperties = 0; // 记录被清除的属性掩码
  }
  // ==========================
  // 值（Value）相关方法
  // ==========================
  CellDelta.prototype.setValue = function (value) {
    if (value === null || value === undefined) {
      console.error('Set "value" to null or undefined is not supported.');
      return this.clearValue();
    }
    this.value = value;
    return this;
  };
  CellDelta.prototype.clearValue = function () {
    if (this.value !== undefined) {
      this.value = undefined;
    }
    return this;
  };
  CellDelta.prototype.getValue = function () {
    return this.value;
  };
  // ==========================
  // 公式（Formula）相关方法
  // ==========================
  CellDelta.prototype.setFormula = function (formula) {
    if (formula === null || formula === undefined) {
      console.error('Set "formula" to null or undefined is not supported.');
      return this.clearFormula();
    }
    this.formula = formula;
    return this;
  };
  CellDelta.prototype.clearFormula = function () {
    if (this.formula !== undefined) {
      this.formula = undefined;
    }
    return this;
  };
  CellDelta.prototype.getFormula = function () {
    return this.formula;
  };
  CellDelta.prototype.setFormat = function (format) {
    if (format === null || format === undefined) {
      console.error('Set "format" to null or undefined is not supported.');
      return this.clearFormat();
    }
    this.format = { ...this.format, ...format };
    return this;
  };
  CellDelta.prototype.clearFormat = function () {
    if (this.format !== undefined) {
      this.format = undefined;
    }
    return this;
  };
  CellDelta.prototype.getFormat = function () {
    return this.format;
  };
  // ==========================
  // 验证规则（Validation）相关方法
  // ==========================
  CellDelta.prototype.setValidation = function (validation) {
    if (validation === null || validation === undefined) {
      console.error('Set "validation" to null or undefined is not supported.');
      return this.clearValidation();
    }
    this.validation = validation;
    return this;
  };
  CellDelta.prototype.clearValidation = function () {
    if (this.validation !== undefined) {
      this.validation = undefined;
    }
    return this;
  };
  CellDelta.prototype.getValidation = function () {
    return this.validation;
  };
  // ==========================
  //   COMMENT（注释）属性方法
  // ==========================
  CellDelta.prototype.setComment = function (comment) {
    if (comment === null || comment === undefined) {
      console.error('Set "comment" to null or undefined is not supported.');
      return this.clearComment();
    }
    this.comment = comment;
    return this;
  };
  CellDelta.prototype.clearComment = function () {
    if (this.comment !== undefined) {
      this.comment = undefined;
    }
    return this;
  };
  CellDelta.prototype.getComment = function () {
    return this.comment;
  };
  // ==========================
  //   LINK（超链接）属性方法
  // ==========================
  CellDelta.prototype.setLink = function (link) {
    if (link === null || link === undefined || !link.url) {
      console.error('Set "link" requires a valid URL.');
      return this.clearLink();
    }
    this.link = link;
    return this;
  };
  CellDelta.prototype.clearLink = function () {
    if (this.link !== undefined) {
      this.link = undefined;
    }
    return this;
  };
  CellDelta.prototype.getLink = function () {
    return this.link;
  };
  return CellDelta;
})();
/**
 * 单元格增量构建器
 * 负责构建单元格的增量变化信息，与CellDelta配套使用
 */
let CellDeltaBuilder = /** @class */ (function () {
  function CellDeltaBuilder() {
    this.setMask = 0; // 设置掩码：标记哪些属性需要被设置
    this.clearMask = 0; // 清除掩码：标记哪些属性需要被清除
    this.delta = new CellDelta();
  }
  /**
   * 标记属性为"需要设置"状态
   */
  CellDeltaBuilder.prototype.markAsSet = function (property) {
    this.setMask |= property; // 设置对应位为1
    this.clearMask &= ~property; // 确保清除掩码中对应位为0
  };
  /**
   * 标记属性为"需要清除"状态
   */
  CellDeltaBuilder.prototype.markAsClear = function (property) {
    this.clearMask |= property; // 设置对应位为1
    this.setMask &= ~property; // 确保设置掩码中对应位为0
  };
  /**
   * 设置单元格值
   */
  CellDeltaBuilder.prototype.setValue = function (value) {
    this.markAsSet(CellProperty.VALUE);
    this.delta.setValue(value);
    return this;
  };
  /**
   * 清除单元格值
   */
  CellDeltaBuilder.prototype.clearValue = function () {
    this.markAsClear(CellProperty.VALUE);
    this.delta.clearValue();
    return this;
  };
  /**
   * 设置单元格公式
   */
  CellDeltaBuilder.prototype.setFormula = function (formula) {
    this.markAsSet(CellProperty.FORMULA);
    this.delta.setFormula(formula);
    return this;
  };
  /**
   * 清除单元格公式
   */
  CellDeltaBuilder.prototype.clearFormula = function () {
    this.markAsClear(CellProperty.FORMULA);
    this.delta.clearFormula();
    return this;
  };
  /**
   * 设置单元格格式
   */
  CellDeltaBuilder.prototype.setFormat = function (format) {
    this.markAsSet(CellProperty.FORMAT);
    this.delta.setFormat(format);
    return this;
  };
  /**
   * 清除单元格格式
   */
  CellDeltaBuilder.prototype.clearFormat = function () {
    this.markAsClear(CellProperty.FORMAT);
    this.delta.clearFormat();
    return this;
  };
  /**
   * 设置数据验证规则
   */
  CellDeltaBuilder.prototype.setValidation = function (validation) {
    this.markAsSet(CellProperty.VALIDATION);
    this.delta.setValidation(validation);
    return this;
  };
  /**
   * 清除数据验证规则
   */
  CellDeltaBuilder.prototype.clearValidation = function () {
    this.markAsClear(CellProperty.VALIDATION);
    this.delta.clearValidation();
    return this;
  };
  CellDeltaBuilder.prototype.setComment = function (comment) {
    this.markAsSet(CellProperty.COMMENT);
    this.delta.setComment(comment);
    return this;
  };
  CellDeltaBuilder.prototype.clearComment = function () {
    this.markAsClear(CellProperty.COMMENT);
    this.delta.clearComment();
    return this;
  };
  CellDeltaBuilder.prototype.setLink = function (link) {
    this.markAsSet(CellProperty.LINK);
    this.delta.setLink(link);
    return this;
  };
  CellDeltaBuilder.prototype.clearLink = function () {
    this.markAsClear(CellProperty.LINK);
    this.delta.clearLink();
    return this;
  };
  /**
   * 检查是否包含指定属性的设置
   */
  CellDeltaBuilder.prototype.hasProperty = function (property) {
    return (this.setMask & property) !== 0;
  };
  /**
   * 构建最终的单元格增量对象
   */
  CellDeltaBuilder.prototype.build = function () {
    if (this.setMask > 0) {
      this.delta.setProperties = this.setMask;
    }
    if (this.clearMask > 0) {
      this.delta.clearProperties = this.clearMask;
    }
    return this.delta;
  };
  return CellDeltaBuilder;
})();
// 使用示例
let builder = new CellDeltaBuilder();
// 构建单元格增量
builder.setValue(100).clearFormula().setValidation({ type: 'number', rule: '>=0' });
// 生成最终的增量对象
let delta = builder.build();
console.log('🚀 ~ delta:', delta);
