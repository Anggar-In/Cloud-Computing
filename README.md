## Prasyarat

Sebelum memulai, pastikan telah menginstal :

- [Node.js](https://nodejs.org/en/download/) (versi 16 ke atas)
- [MySQL](https://dev.mysql.com/downloads/installer/) atau MariaDB


## How To Setup Api Anggar.in

1. npm install
2. npm init --y
3. npm install express jwt-simple bcryptjs body-parser mysql2
4. npm install dotenv
5. npm install uuid
6. npm install tesseract.js
7. npm install multer

## Routes To Test API

### POST
1. POST http://localhost:3000/api/auth/register
2. POST http://localhost:3000/api/auth/login
3. POST http://localhost:3000/api/transaction
4. POST http://localhost:3000/api/upload-receipt
5. POST http://localhost:3000/api/budget
6. POST http://localhost:3000/api/auth/logout
7. POST http://localhost:3000/api/expense

### GET
1. GET http://localhost:3000/api/budgets/:user_id
2. GET http://localhost:3000/api/expenses/:user_id

### PUT
1. PUT http://localhost:3000/api/budget/:budget_id
2. PUT http://localhost:3000/api/expense/:expense_id

### DELETE
1. DELETE http://localhost:3000/api/budget/:budget_id
2. DELETE http://localhost:3000/api/expense/:expense_id
