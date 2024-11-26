<<<<<<< HEAD
const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');

async function connectDB() {
  try {
    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log("Connected to MySQL database");

    return db; 
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

module.exports = connectDB;
=======
const mysql = require("mysql2");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("./config");
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;
>>>>>>> f186631f2b34b20dafb1ea9ceee0cc95dc1e2931
