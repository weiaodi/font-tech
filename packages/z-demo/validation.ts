/* eslint-disable no-redeclare */
// 辅助类型：提取函数参数类型
type FirstParameter<T> = T extends (arg: infer P, ...rest: any[]) => any ? P : never;

// 辅助类型：合并多个类型为交叉类型
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// 验证器函数类型
type Validator<T> = (judgements: T) => boolean;

// 函数重载：严格限制最多5个参数
function validationPipeline<T1 extends Validator<any>>(v1: T1): (judgements: FirstParameter<T1>) => boolean;

function validationPipeline<T1 extends Validator<any>, T2 extends Validator<any>>(
  v1: T1,
  v2: T2,
): (judgements: UnionToIntersection<FirstParameter<T1> & FirstParameter<T2>>) => boolean;

function validationPipeline<T1 extends Validator<any>, T2 extends Validator<any>, T3 extends Validator<any>>(
  v1: T1,
  v2: T2,
  v3: T3,
): (judgements: UnionToIntersection<FirstParameter<T1> & FirstParameter<T2> & FirstParameter<T3>>) => boolean;

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
  judgements: UnionToIntersection<FirstParameter<T1> & FirstParameter<T2> & FirstParameter<T3> & FirstParameter<T4>>,
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
  judgements: UnionToIntersection<
    FirstParameter<T1> & FirstParameter<T2> & FirstParameter<T3> & FirstParameter<T4> & FirstParameter<T5>
  >,
) => boolean;

// 管道函数，按照写入顺序进行逻辑判断
function validationPipeline(...validators: Validator<any>[]): (judgements: any) => boolean {
  if (validators.length > 5) {
    throw new Error('validationPipeline 最多支持5个验证器');
  }
  // 这里代表每个函数都需要为true才会返回true 如果需要部分满足可以调整为 validators.some
  return (judgements: any) => validators.every((validator) => validator(judgements));
}

// 验证器函数
const checkjudgements = (judgements: { judgements: boolean; judgements1: boolean }) =>
  judgements.judgements && judgements.judgements1 === true;
const checkFirstItem = (judgements: { index: number }) => judgements.index === 0;
const checkDefault = (judgements: { disabled: boolean }) => judgements.disabled;
const checkDefault1 = (judgements: { disabled1111: boolean }) => judgements.disabled1111;

// 自动推导出配置类型为 '{ judgements: boolean; judgements1: boolean; } & { index: number; } & { disabled: boolean; } & { disabled1111: boolean; }'
const is = validationPipeline(
  checkjudgements,
  checkFirstItem,
  checkDefault,
  checkDefault1,
)({
  judgements: false,
  judgements1: false,
  index: 0,
  disabled: false,
  disabled1111: false,
});
