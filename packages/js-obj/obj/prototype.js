function Person() {
  this.getName = function () {
    console.log('person');
  };
}
Person.prototype.getProtoName = function () {
  console.log('proto person');
};
const person = new Person();

console.log('🚀 ~ console:', Object.getPrototypeOf(person), Person.prototype, Person.prototype.constructor);
