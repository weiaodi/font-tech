class RefImpl {
  #value = ''; // #value 私有属性

  constructor(value) {
    this.#value = value;
  }
  get value() {
    console.log('触发获取', this.#value);
    return this.#value;
  }
  set value(newVal) {
    console.log('触发更新', newVal);
    this.#value = newVal;
  }
}

function ref(value) {
  return new RefImpl(value);
}

const test = ref('demo');

setTimeout(() => {
  test.value = '我设置了值';
}, 2000);
