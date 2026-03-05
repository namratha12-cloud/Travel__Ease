// db/db.js
const mysql = require('mysql2/promise');
const config = { host: 'localhost', user: 'root', password: 'password', database: 'Travels1' };

async function query(sql, params) {
  const conn = await mysql.createConnection(config);
  const [results] = await conn.execute(sql, params);
  await conn.end();
  return results;
}

module.exports = { query };
