function Router() {
  this.routes = {};
  this.currentUrl = '';
}
Router.prototype.route = function (path, callback) {
  this.routes[path] = callback || function () {};
};
Router.prototype.refresh = function () {
  // eslint-disable-next-line no-restricted-globals
  this.currentUrl = location.hash.slice(1) || '/';
  this.routes[this.currentUrl]();
};
Router.prototype.init = function () {
  window.addEventListener('load', this.refresh.bind(this), false);
  window.addEventListener('hashchange', this.refresh.bind(this), false);
};
window.Router = new Router();
window.Router.init();

let content = document.querySelector('body');
// change Page anything
function changeBgColor(color) {
  content.style.backgroundColor = color;
}

Router.route('/', function () {
  changeBgColor('white');
});
Router.route('/blue', function () {
  changeBgColor('blue');
});
Router.route('/green', function () {
  changeBgColor('green');
});
