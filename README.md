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

## Set Up To Test API

### User Registration

- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  - `name` as string
  - `email` as string, must be unique
  - `password` as string, must be at least 8 characters
- **Response**:
json { "error": false, "message": "Registration successful, OTP sent to email" }

### Verify OTP

- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Request Body**:
  - `email` as string
  - `otp` as string
- **Response**:
json { "error": false, "message": "OTP verified successfully" }

### Resend OTP

- **URL**: `/resend-otp`
- **Method**: `POST`
- **Request Body**:
  - `email` as string
- **Response**:
json { "error": false, "message": "OTP baru telah dikirim ke email Anda." }

### User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email` as string
  - `password` as string
- **Response**:
json { "error": false, "message": "Login berhasil", "token": "your_jwt_token" }

### Get User by ID

- **URL**: `/:user_id`
- **Method**: `GET`
- **Response**:
json { "transactions": [ { "user_id": "user_id_value", "name": "user_name", "email": "user@example.com" } ] }

### Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Response**:
json { "message": "Logout successful" }


### Get User Profile

- **URL**: `/user/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "user_id": "user_id_value", "fullname": "user_name", "date_of_birth": "YYYY-MM-DD", "phone_number": "1234567890" }

### Update User Profile

- **URL**: `/user/profile`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "fullname": "user_name", "date_of_birth": "YYYY-MM-DD", "phone_number": "1234567890" }

### Post Voice Input

- **URL**: `/voice-input`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `your_category_id`
- **Response**:
json { "error": false, "message": "Income recorded successfully", "income_id": "income_id_value" }


### Post Receipt

- **URL**: `/upload-receipt`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**: (form-data)
  - `receipt`: (file)
- **Response**:
json { "message": "Receipt scanned and expense recorded successfully", "expense_id": "expense_id_value", "extracted_text": "extracted_text_value", "parsed_receipt": { "company": "Company Name", "total": "Total Amount", "items": ["Item 1", "Item 2"] } }

### Post Budget

- **URL**: `/budget`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Budget created successfully", "budget_id": "budget_id_value" }

### Get Budget

- **URL**: `/budget/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "budget_id": "budget_id_value", "user_id": "user_id_value", "income_month": "1000000", "budget_month": "800000" } ]

### Update Budget

- **URL**: `/budget/:budget_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Budget updated successfully" }

### Delete Budget

- **URL**: `/budget/:budget_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Budget deleted successfully" }

### Post Expense

- **URL**: `/expense`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `your_category_id`
- **Response**:
json { "message": "Expense created successfully", "expense_id": "expense_id_value" }


### Get Expense

- **URL**: `/expense/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "Expense_ID": "expense_id_value", "User_ID": "user_id_value", "Expense_amount": 50000, "Expense_date": "2024-12-01", "store": "Store Name", "items": ["Item 1", "Item 2"] } ]


### Update Expense

- **URL**: `/expense/:expense_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `1`
- **Response**:
json { "message": "Expense updated successfully" }

### Delete Expense

- **URL**: `/expense/:expense_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Expense deleted successfully" }

### Get Category

- **URL**: `/category`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "category_id": "category_id_value", "name": "Food", "transaction_type": "expense" } ]

### Post Category

- **URL**: `/category`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Category created successfully", "category_id": "category_id_value" }

### Update Category

- **URL**: `/category/:category_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Category updated successfully" }

### Delete Category

- **URL**: `/category/:category_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Category deleted successfully" }

### Post Income

- **URL**: `/income`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `2`
- **Response**:
json { "message": "Income created successfully", "income_id": "income_id_value" }

### Get Income

- **URL**: `/income/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json [ { "income_id": "income_id_value", "user_id": "user_id_value", "income_amount": 1000000, "income_date": "2024-12-01", "description": "Salary" } ]

### Update Income

- **URL**: `/income/:income_id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `2`
- **Response**:
json { "message": "Income updated successfully" }

### Delete Income

- **URL**: `/income/:income_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json { "message": "Income deleted successfully" }

### Get Report Analysis

- **URL**: `/report-analysis`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Query Parameters**:
  - `period`: `daily`, `weekly`, or `monthly`
- **Response**:
json { "totalIncome": 1000000, "totalExpense": 50000, "netBalance": 950000, "incomePercentage": "95.00", "expensePercentage": "5.00", "categories": [ { "name": "Food", "total_expense": 50000 } ] }

### Post Financial Goals

- **URL**: `/financial-goals`
- **Method**: `POST`
- **Response**:
json { "message": "Saving goals created successfully", "goal_id": "goal_id_value" }

### Get Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `GET`
- **Response**:
json { "goal_id": "goal_id_value", "user_id": "user_id_value", "goal_name": "Save for Vacation", "target_amount": 2000000, "current_amount": 500000, "start_date": "2024-01-01", "goal_deadline": "2024-12-31" }

### Update Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `PUT`
- **Response**:
json { "message": "Goal updated successfully" }

### Delete Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `DELETE`
- **Response**:
json { "message": "Goal deleted successfully" }




