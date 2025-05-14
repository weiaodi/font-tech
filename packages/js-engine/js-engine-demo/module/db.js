// db.js
class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = Math.random(); // 使用随机数验证
      Database.instance = this;
    }
    // eslint-disable-next-line no-constructor-return
    return Database.instance;
  }
}

export default Database;
