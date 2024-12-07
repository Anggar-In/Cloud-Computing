const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');

async function connectDB() {
  try {
    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
<<<<<<< HEAD
    });

    console.log("Connected to MySQL database");

=======
      port: 3306,
    });
    console.log("Connected to MySQL database");
>>>>>>> 3ac12cd4eb0066f188561a68336e695822eea286
    return db; 
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

module.exports = connectDB;
