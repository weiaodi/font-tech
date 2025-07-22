/* eslint-disable no-redeclare */
// 辅助类型：提取函数参数类型
type FirstParameter<T> = T extends (arg: infer P, ...rest: any[]) => any ? P : never;

// 辅助类型：合并多个类型为交叉类型
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// 验证器类型
type Validator<T> = (config: T) => boolean;

// 函数重载：严格限制最多5个参数
function validationPipeline<T1 extends Validator<any>>(v1: T1): (config: FirstParameter<T1>) => boolean;

function validationPipeline<T1 extends Validator<any>, T2 extends Validator<any>>(
  v1: T1,
  v2: T2,
): (config: UnionToIntersection<FirstParameter<T1> & FirstParameter<T2>>) => boolean;

function validationPipeline<T1 extends Validator<any>, T2 extends Validator<any>, T3 extends Validator<any>>(
  v1: T1,
  v2: T2,
  v3: T3,
): (config: UnionToIntersection<FirstParameter<T1> & FirstParameter<T2> & FirstParameter<T3>>) => boolean;

function validationPipeline<
  T1 extends Validator<any>,
  T2 extends Validator<any>,
  T3 extends Validator<any>,
  T4 extends Validator<any>,
>(
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
): (
  config: UnionToIntersection<FirstParameter<T1> & FirstParameter<T2> & FirstParameter<T3> & FirstParameter<T4>>,
) => boolean;

function validationPipeline<
  T1 extends Validator<any>,
  T2 extends Validator<any>,
  T3 extends Validator<any>,
  T4 extends Validator<any>,
  T5 extends Validator<any>,
>(
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
): (
  config: UnionToIntersection<
    FirstParameter<T1> & FirstParameter<T2> & FirstParameter<T3> & FirstParameter<T4> & FirstParameter<T5>
  >,
) => boolean;

// 实现签名
function validationPipeline(...validators: Validator<any>[]): (config: any) => boolean {
  if (validators.length > 5) {
    throw new Error('validationPipeline 最多支持5个验证器');
  }

  return (config: any) => validators.some((validator) => validator(config));
}

// 独立验证函数 - 每个函数可以定义自己需要的参数
const checkConfig = (config: { config: boolean }) => config.config === true;
const checkFirstItem = (config: { index: number }) => config.index === 0;
const checkDefault = (config: { disabled: boolean }) => config.disabled;

// 使用示例 - 自动推导出配置类型为 { config: boolean; index: number; disabled: boolean }
const isDisabled = validationPipeline(checkConfig, checkFirstItem, checkDefault);

// 现在可以直接使用，无需显式定义配置类型
isDisabled({
  config: false,
  index: 0,
  disabled: false,
});
