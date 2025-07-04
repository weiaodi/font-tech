function isString(s) {
  return typeof s === 'string';
}
function toUpperCase(x) {
  if (isString(x)) {
    x.toUpperCase();
  }
}
function isStringNormal(s) {
  return typeof s === 'string';
}
function toUpperCaseNormal(x) {
  if (isStringNormal(x)) {
    x.toUpperCase();
  }
}
function name(params) {}
