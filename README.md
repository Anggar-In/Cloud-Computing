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
8. npm install nodemailer
9. npm install swagger-ui-express js-yaml

## Set Up To Test API

### 1. User Registration

- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  - `name` as string
  - `email` as string, must be unique
  - `password` as string, must be at least 8 characters
- **Request Body**:
```
{
  "name": "namamu",
  "email": "akunmu@example.com",
  "password": "passwordmu"
}
```
- **Response**:
json { "error": false, "message": "Registration successful, OTP sent to email" }

### 2. Verify OTP

- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Request Body**:
  - `email` as string
  - `otp` as string
- **Request Body**:
```
{
  "email": "akunmu@example.com",
  "otp": "otp_mu"
}
```
- **Response**:
json { "error": false, "message": "OTP verified successfully" }

### 3. Resend OTP

- **URL**: `/resend-otp`
- **Method**: `POST`
- **Request Body**:
  - `email` as string
- **Request Body**:
```
{
  "email": "akunmu@example.com""
}
```
- **Response**:
json { "error": false, "message": "OTP baru telah dikirim ke email Anda." }

### 4. User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email` as string
  - `password` as string
- **Request Body**:
```
{
  "email": "akunmu@example.com",
  "password": "passwordmu"
}
```
- **Response**:
json { "error": false, "message": "Login berhasil", "token": "your_jwt_token" }

### 5. Get User by ID

- **URL**: `/:user_id`
- **Method**: `GET`
- **Response**:
json { "transactions": [ { "user_id": "user_id_value", "name": "user_name", "email": "user@example.com" } ] }

### 6. Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Authorization**:
  - `Bearer Token {{token}}`
- **Response**:
json { "message": "Logout successful" }


### 7. Get User Profile

- **URL**: `/user/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "user_id": "user_id_value", "fullname": "user_name", "date_of_birth": "YYYY-MM-DD", "phone_number": "1234567890" }

### 8. Update User Profile

- **URL**: `/user/profile`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**:
```
{
  "fullname": "John Doe",
  "date_of_birth": "1990-01-01",
  "phone_number": "1234567890"
}
```
- **Response**:
json { "fullname": "user_name", "date_of_birth": "YYYY-MM-DD", "phone_number": "1234567890" }

### 9. Post Voice Input

- **URL**: `/voice-input`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `your_category_id`
- **Request Body**:
```
{
  "fullTranscriptText": "Pengeluaran untuk belanja adalah 100 ribu"
}
```
- **Response**:
json { "error": false, "message": "Income recorded successfully", "income_id": "income_id_value" }


### 10. Post Receipt

- **URL**: `/upload-receipt`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**: (form-data)
  - `receipt`: (file)
- **Response**:
json { "message": "Receipt scanned and expense recorded successfully", "expense_id": "expense_id_value", "extracted_text": "extracted_text_value", "parsed_receipt": { "company": "Company Name", "total": "Total Amount", "items": ["Item 1", "Item 2"] } }

### 11. Post Budget

- **URL**: `/budget`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**:
```
{
  "income_month": 5000,
  "budget_month": 3000
}
```
- **Response**:
json { "message": "Budget created successfully", "budget_id": "budget_id_value" }

### 12. Get Budget

- **URL**: `/budget/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "budget_id": "budget_id_value", "user_id": "user_id_value", "income_month": "1000000", "budget_month": "800000" } ]

### 13. Update Budget

- **URL**: `/budget/:budget_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**:
```
{
  "income_month": 6000,
  "budget_month": 3500
}
```
- **Response**:
json { "message": "Budget updated successfully" }

### 14. Delete Budget

- **URL**: `/budget/:budget_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Budget deleted successfully" }

### 15. Post Expense

- **URL**: `/expense`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `your_category_id`
- **Request Body**:
```
{
  "expense_amount": 100,
  "expense_date": "2024-12-07",
  "store": "Grocery Store",
  "items": ["Milk", "Bread"]
}
```
- **Response**:
json { "message": "Expense created successfully", "expense_id": "expense_id_value" }


### 16. Get Expense

- **URL**: `/expense/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "Expense_ID": "expense_id_value", "User_ID": "user_id_value", "Expense_amount": 50000, "Expense_date": "2024-12-01", "store": "Store Name", "items": ["Item 1", "Item 2"] } ]


### 17. Update Expense

- **URL**: `/expense/:expense_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `1`
- **Request Body**:
```
{
  "expense_amount": 150,
  "expense_date": "2024-12-08",
  "store": "Supermarket",
  "items": ["Eggs", "Cheese"]
}
```
- **Response**:
json { "message": "Expense updated successfully" }

### 18. Delete Expense

- **URL**: `/expense/:expense_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Expense deleted successfully" }

### 19. Get Category

- **URL**: `/category`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "category_id": "category_id_value", "name": "Food", "transaction_type": "expense" } ]

### 20. Post Category

- **URL**: `/category`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**:
```
{
  "name": "Food",
  "transaction_type": "expense"
}
```
- **Response**:
json { "message": "Category created successfully", "category_id": "category_id_value" }

### 21. Update Category

- **URL**: `/category/:category_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**:
```
{
  "name": "Food"
}
```
- **Response**:
json { "message": "Category updated successfully" }

### 22. Delete Category

- **URL**: `/category/:category_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Category deleted successfully" }

### 23. Post Income

- **URL**: `/income`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `2`
- **Request Body**:
```
{
  "income_amount": 2000,
  "income_date": "2024-12-07",
  "description": "Salary"
}
```
- **Response**:
json { "message": "Income created successfully", "income_id": "income_id_value" }

### 24. Get Income

- **URL**: `/income/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "income_id": "income_id_value", "user_id": "user_id_value", "income_amount": 1000000, "income_date": "2024-12-01", "description": "Salary" } ]

### 25. Update Income

- **URL**: `/income/:income_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `2`
```
{
  "income_amount": 2000,
  "income_date": "2024-12-07",
  "description": "Salary"
}
```
- **Response**:
json { "message": "Income updated successfully" }

### 26. Delete Income

- **URL**: `/income/:income_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Income deleted successfully" }

### 27. Get Report Analysis

- **URL**: `/report-analysis`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Query Parameters**:
  - `period`: `daily`, `weekly`, or `monthly`
- **Response**:
json { "totalIncome": 1000000, "totalExpense": 50000, "netBalance": 950000, "incomePercentage": "95.00", "expensePercentage": "5.00", "categories": [ { "name": "Food", "total_expense": 50000 } ] }

### 28. Post Financial Goals

- **URL**: `/financial-goals`
- **Method**: `POST`
- **Request Body**:
```
{
  "goal_name": "Buy a Car",
  "target_amount": 20000,
  "current_amount": 5000,
  "start_date": "2024-01-01",
  "goal_deadline": "2025-01-01"
}
```
- **Response**:
json { "message": "Saving goals created successfully", "goal_id": "goal_id_value" }

### 29. Get Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `GET`
- **Response**:
json { "goal_id": "goal_id_value", "user_id": "user_id_value", "goal_name": "Save for Vacation", "target_amount": 2000000, "current_amount": 500000, "start_date": "2024-01-01", "goal_deadline": "2024-12-31" }

### 30. Update Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `PUT`
```
{
  "goal_name": "Buy a House",
  "target_amount": 50000,
  "current_amount": 10000,
  "start_date": "2024-01-01",
  "goal_deadline": "2026-01-01"
}
```
- **Response**:
json { "message": "Goal updated successfully" }

### 31. Delete Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `DELETE`
- **Response**:
json { "message": "Goal deleted successfully" }




