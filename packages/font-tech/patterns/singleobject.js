/* eslint-disable */
class Database {
  constructor() {
    // 如果已存在实例，直接返回
    if (Database.instance) {
      return Database.instance;
    }

    // 初始化操作
    this.connect();
    Database.instance = this;
  }

  connect() {
    console.log('连接数据库...');
  }

  query(sql) {
    console.log(`执行查询: ${sql}`);
  }
}

// 使用示例
const db1 = new Database();
const db2 = new Database();

console.log(db1 === db2); // true（同一个实例）
db1.query('SELECT * FROM users'); // 执行查询
