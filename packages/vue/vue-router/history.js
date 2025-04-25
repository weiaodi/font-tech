/* eslint-disable */
// 在history实例中管理
class Router {
  constructor() {
    this.routes = new Map();
    this.init();
  }
  change(e) {
    console.log('🚀 ~ Router ~ change ~ e:', e);
    // 防止为null
    const { path } = e.state || {};
    this.implement(path);
  }
  init() {
    window.addEventListener('popstate', this.change.bind(this));
    window.addEventListener('load', () => {
      const { pathname } = location;
      history.replaceState({ path: pathname }, '', pathname);
      this.implement(pathname);
    });
  }
  implement(path) {
    if (!this.routes.has(path)) {
      return;
    }
    const fn = this.routes.get(path);
    console.log('🚀 ~ Router ~ implement ~ fn:', fn);
    typeof fn == 'function' && fn.call(this, path);
  }
  go(num) {
    history.go(num);
  }
  route(state, fn) {
    this.routes.set(state, fn);
  }
  push(state) {
    history.pushState({ path: state }, '', state);
    this.implement(state);
  }
  replace(state) {
    history.replaceState({ path: state }, '', state);
    this.implement(state);
  }
}

const color = {
  '/': 'yellow',
  '/hash2': '#333',
  '/hash3': '#DDD',
};
const route = new Router();
route.route('/', function (e) {
  document.body.style.background = color[e];
});
route.route('/hash2', function (e) {
  document.body.style.background = color[e];
});
route.route('/hash3', function (e) {
  document.body.style.background = color[e];
});

Array.from(document.links).forEach((fn) => {
  fn.addEventListener('click', (e) => {
    e.preventDefault();
    const href = fn.href;
    const { pathname } = new URL(href);
    route.push(pathname);
  });
});

const backOff = document.querySelector('.b');
const forward = document.querySelector('.f');
backOff.addEventListener('click', () => route.go(-1));
forward.addEventListener('click', () => route.go(1));
