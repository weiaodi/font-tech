/* eslint-disable */
// 抽象工厂接口
class AbstractUIFactory {
  createButton() {
    throw new Error('此方法必须被重写');
  }
  createInput() {
    throw new Error('此方法必须被重写');
  }
}

// 具体工厂：创建深色主题UI组件
class DarkThemeFactory extends AbstractUIFactory {
  createButton() {
    return new DarkButton();
  }
  createInput() {
    return new DarkInput();
  }
}

// 具体工厂：创建浅色主题UI组件
class LightThemeFactory extends AbstractUIFactory {
  createButton() {
    return new LightButton();
  }
  createInput() {
    return new LightInput();
  }
}

// 按钮产品的抽象接口（实际使用中可省略）
class AbstractButton {
  render() {
    throw new Error('此方法必须被重写');
  }
}

// 输入框产品的抽象接口（实际使用中可省略）
class AbstractInput {
  render() {
    throw new Error('此方法必须被重写');
  }
}

// 深色主题具体产品
class DarkButton extends AbstractButton {
  render() {
    console.log('渲染深色按钮');
  }
}

class DarkInput extends AbstractInput {
  render() {
    console.log('渲染深色输入框');
  }
}

// 浅色主题具体产品
class LightButton extends AbstractButton {
  render() {
    console.log('渲染浅色按钮');
  }
}

class LightInput extends AbstractInput {
  render() {
    console.log('渲染浅色输入框');
  }
}

// 使用抽象工厂创建产品族
const darkFactory = new DarkThemeFactory();
const lightFactory = new LightThemeFactory();

// 创建深色主题UI组件
const darkButton = darkFactory.createButton();
const darkInput = darkFactory.createInput();

// 创建浅色主题UI组件
const lightButton = lightFactory.createButton();
const lightInput = lightFactory.createInput();

// 渲染所有组件
darkButton.render(); // 输出: 渲染深色按钮
darkInput.render(); // 输出: 渲染深色输入框
lightButton.render(); // 输出: 渲染浅色按钮
lightInput.render(); // 输出: 渲染浅色输入框

// 优势
// 动态切换主题工厂
function renderUI(factory) {
  const button = factory.createButton();
  const input = factory.createInput();
  button.render();
  input.render();
}

// 渲染深色UI
renderUI(new DarkThemeFactory());

// 渲染浅色UI
renderUI(new LightThemeFactory());
