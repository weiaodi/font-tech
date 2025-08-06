/* eslint-disable max-classes-per-file */
/**
 * 完整的单元格增量系统
 * 包含属性定义、数据存储对象和构建器
 */

// 定义单元格支持的属性（槽位）
enum CellProperty {
  VALUE = 1 << 0, // 1 (二进制: 0001)
  FORMULA = 1 << 1, // 2 (二进制: 0010)
  FORMAT = 1 << 2, // 4 (二进制: 0100)
  VALIDATION = 1 << 3, // 8 (二进制: 1000)
  COMMENT = 1 << 4, // 16 (10000)
  LINK = 1 << 5, // 32 (100000)
}

// 单元格属性值的类型定义
type CellValue = string | number | boolean | null;
type CellFormat = {
  bold?: boolean;
  italic?: boolean;
  color?: string;
};
type CellValidation = {
  type: 'number' | 'text' | 'list';
  rule: string;
};

type CellComment = {
  author: string;
  content: string;
};
type CellLink = {
  url: string;
  displayText?: string;
};

/**
 * 单元格增量对象，存储实际的属性变化
 * 包含属性的设置和清除方法，遵循链式调用风格
 */
class CellDelta {
  setProperties: number = 0; // 记录被设置的属性掩码
  clearProperties: number = 0; // 记录被清除的属性掩码

  // 实际存储的属性值
  private value?: CellValue;
  private formula?: string;
  private format?: CellFormat;
  private validation?: CellValidation;
  private comment?: CellComment;
  private link?: CellLink;

  // ==========================
  // 值（Value）相关方法
  // ==========================
  public setValue(value: CellValue): this {
    if (value === null || value === undefined) {
      console.error(`Set "value" to null or undefined is not supported.`);
      return this.clearValue();
    }
    this.value = value;
    return this;
  }

  public clearValue(): this {
    if (this.value !== undefined) {
      this.value = undefined;
    }
    return this;
  }

  public getValue(): CellValue | undefined {
    return this.value;
  }

  // ==========================
  // 公式（Formula）相关方法
  // ==========================
  public setFormula(formula: string): this {
    if (formula === null || formula === undefined) {
      console.error(`Set "formula" to null or undefined is not supported.`);
      return this.clearFormula();
    }
    this.formula = formula;
    return this;
  }

  public clearFormula(): this {
    if (this.formula !== undefined) {
      this.formula = undefined;
    }
    return this;
  }

  public getFormula(): string | undefined {
    return this.formula;
  }

  public setFormat(format: CellFormat): this {
    if (format === null || format === undefined) {
      console.error(`Set "format" to null or undefined is not supported.`);
      return this.clearFormat();
    }
    this.format = { ...this.format, ...format };
    return this;
  }

  public clearFormat(): this {
    if (this.format !== undefined) {
      this.format = undefined;
    }
    return this;
  }

  public getFormat(): CellFormat | undefined {
    return this.format;
  }

  // ==========================
  // 验证规则（Validation）相关方法
  // ==========================
  public setValidation(validation: CellValidation): this {
    if (validation === null || validation === undefined) {
      console.error(`Set "validation" to null or undefined is not supported.`);
      return this.clearValidation();
    }
    this.validation = validation;
    return this;
  }

  public clearValidation(): this {
    if (this.validation !== undefined) {
      this.validation = undefined;
    }
    return this;
  }

  public getValidation(): CellValidation | undefined {
    return this.validation;
  }
  // ==========================
  //   COMMENT（注释）属性方法
  // ==========================
  public setComment(comment: CellComment): this {
    if (comment === null || comment === undefined) {
      console.error(`Set "comment" to null or undefined is not supported.`);
      return this.clearComment();
    }
    this.comment = comment;
    return this;
  }

  public clearComment(): this {
    if (this.comment !== undefined) {
      this.comment = undefined;
    }
    return this;
  }

  public getComment(): CellComment | undefined {
    return this.comment;
  }

  // ==========================
  //   LINK（超链接）属性方法
  // ==========================
  public setLink(link: CellLink): this {
    if (link === null || link === undefined || !link.url) {
      console.error(`Set "link" requires a valid URL.`);
      return this.clearLink();
    }
    this.link = link;
    return this;
  }

  public clearLink(): this {
    if (this.link !== undefined) {
      this.link = undefined;
    }
    return this;
  }

  public getLink(): CellLink | undefined {
    return this.link;
  }
}

/**
 * 单元格增量构建器
 * 负责构建单元格的增量变化信息，与CellDelta配套使用
 */
class CellDeltaBuilder {
  private setMask: number = 0; // 设置掩码：标记哪些属性需要被设置
  private clearMask: number = 0; // 清除掩码：标记哪些属性需要被清除
  private delta: CellDelta; // 存储实际属性值的增量对象

  constructor() {
    this.delta = new CellDelta();
  }

  /**
   * 标记属性为"需要设置"状态
   */
  private markAsSet(property: CellProperty): void {
    this.setMask |= property; // 设置对应位为1
    this.clearMask &= ~property; // 确保清除掩码中对应位为0
  }

  /**
   * 标记属性为"需要清除"状态
   */
  private markAsClear(property: CellProperty): void {
    this.clearMask |= property; // 设置对应位为1
    this.setMask &= ~property; // 确保设置掩码中对应位为0
  }

  /**
   * 设置单元格值
   */
  setValue(value: CellValue): this {
    this.markAsSet(CellProperty.VALUE);
    this.delta.setValue(value);
    return this;
  }

  /**
   * 清除单元格值
   */
  clearValue(): this {
    this.markAsClear(CellProperty.VALUE);
    this.delta.clearValue();
    return this;
  }

  /**
   * 设置单元格公式
   */
  setFormula(formula: string): this {
    this.markAsSet(CellProperty.FORMULA);
    this.delta.setFormula(formula);
    return this;
  }

  /**
   * 清除单元格公式
   */
  clearFormula(): this {
    this.markAsClear(CellProperty.FORMULA);
    this.delta.clearFormula();
    return this;
  }

  /**
   * 设置单元格格式
   */
  setFormat(format: CellFormat): this {
    this.markAsSet(CellProperty.FORMAT);
    this.delta.setFormat(format);
    return this;
  }

  /**
   * 清除单元格格式
   */
  clearFormat(): this {
    this.markAsClear(CellProperty.FORMAT);
    this.delta.clearFormat();
    return this;
  }

  /**
   * 设置数据验证规则
   */
  setValidation(validation: CellValidation): this {
    this.markAsSet(CellProperty.VALIDATION);
    this.delta.setValidation(validation);
    return this;
  }

  /**
   * 清除数据验证规则
   */
  clearValidation(): this {
    this.markAsClear(CellProperty.VALIDATION);
    this.delta.clearValidation();
    return this;
  }

  setComment(comment: CellComment): this {
    this.markAsSet(CellProperty.COMMENT);
    this.delta.setComment(comment);
    return this;
  }

  clearComment(): this {
    this.markAsClear(CellProperty.COMMENT);
    this.delta.clearComment();
    return this;
  }

  setLink(link: CellLink): this {
    this.markAsSet(CellProperty.LINK);
    this.delta.setLink(link);
    return this;
  }

  clearLink(): this {
    this.markAsClear(CellProperty.LINK);
    this.delta.clearLink();
    return this;
  }

  /**
   * 检查是否包含指定属性的设置
   */
  hasProperty(property: CellProperty): boolean {
    return (this.setMask & property) !== 0;
  }

  /**
   * 构建最终的单元格增量对象
   */
  build(): CellDelta {
    if (this.setMask > 0) {
      this.delta.setProperties = this.setMask;
    }
    if (this.clearMask > 0) {
      this.delta.clearProperties = this.clearMask;
    }
    return this.delta;
  }
}

// 使用示例
const builder = new CellDeltaBuilder();

// 构建单元格增量
builder.setValue(100).clearFormula().setValidation({ type: 'number', rule: '>=0' });

// 生成最终的增量对象
const delta = builder.build();
console.log('🚀 ~ delta:', delta);
