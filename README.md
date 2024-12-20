<h1 align="center">
<img align="center" src="https://github.com/user-attachments/assets/8a6f2ad2-2fc6-4bd4-ba68-c6674edd655b" alt="Logo Anggarin" width="500" style="border-radius: 50%;"></img>
<br>
<br>
ANGGAR.IN CLOUD COMPUTING DOCUMENTATION
</h1>
<div align="center">

![Contributors](https://img.shields.io/github/contributors/Anggar-In/Cloud-Computing?color=blue)
![Commit Activity](https://img.shields.io/github/commit-activity/m/Anggar-In/Cloud-Computing?color=blue)
![Last Commit](https://img.shields.io/github/last-commit/Anggar-In/Cloud-Computing?color=red)
![Forks](https://img.shields.io/github/forks/Anggar-In/Cloud-Computing?style=flat-square)

</div>

# Team Profile

### Team ID : C242-PS048

### These Are Our Team Members in the Cloud Computing Division:

* (CC) C214B4KY2719 - Muhammad Alvanditya Sasongko - Universitas Islam Indonesia
* (CC) C312B4KY4470 - Whilyan Pratama - Universitas Sebelas Maret

### Roles

* Create User Registration API - Whilyan Pratama (C312B4KY4470)
* Create Verify OTP API - Whilyan Pratama (C312B4KY4470)
* Create Resend OTP API - Whilyan Pratama (C312B4KY4470)
* Create User Login API - Whilyan Pratama (C312B4KY4470)
* Create User API - Whilyan Pratama (C312B4KY4470)
* Create Logout API - Whilyan Pratama (C312B4KY4470)
* Create User Profile API - Whilyan Pratama (C312B4KY4470)
* Create Voice Input API - Whilyan Pratama (C312B4KY4470)
* Create Receipt API - Whilyan Pratama (C312B4KY4470)
* Create Budget API - Whilyan Pratama (C312B4KY4470)
* Create Expense API - Whilyan Pratama (C312B4KY4470)
* Create Category API - Whilyan Pratama (C312B4KY4470)
* Create Income API - Whilyan Pratama (C312B4KY4470)
* Create Report Analysis API - Whilyan Pratama (C312B4KY4470)
* Create API for investment calculator  - Whilyan Pratama (C312B4KY4470)
* Configuration API using google cloud - Muhammad Alvanditya Sasongko (C214B4KY2719)
* Deployment ML model for Investment calculator using google storage - Muhammad Alvanditya Sasongko (C214B4KY2719)
* Create API for investment calculator - Muhammad Alvanditya Sasongko (C214B4KY2719)
* Create API for Investment recomendation - Muhammad Alvanditya Sasongko (C214B4KY2719)
* Create API for Investment prediction - Muhammad Alvanditya Sasongko (C214B4KY2719)
* Create API for Financial goals - Muhammad Alvanditya Sasongko (C214B4KY2719)
* Create database with cmpute engine - Muhammad Alvanditya Sasongko (C214B4KY2719)


# Anggar.In Cloud Computing Project Explanation
This project is our final project for Google Bangkit Academy 2024 Batch 2.

**Project Background:**

Financial stability is crucial for personal and societal well-being, yet many Indonesians face challenges in achieving it. Data from BPS and a 2023 DBS survey indicate a large portion of household income is spent on non-essential items without proper planning. This issue is compounded by low financial literacy, leading to unnecessary spending and limiting the ability to save. If left unaddressed, these problems may prolong financial instability and negatively affect the quality of life in Indonesia.

To tackle this issue, our team developed Anggar.In, a comprehensive financial management solution. The app helps users track income and expenses through manual input, receipt scanning, and voice commands, offering a clear view of spending patterns. Its personalized budgeting feature aids in managing spending limits, while savings goal planning supports consistent savings. Anggar.In also provides financial analysis tools, presenting spending trends and insights to help users become more aware of their finances. The investment recommendation system can also guide users towards financial freedom.

Leveraging machine learning, cloud computing, and mobile technology, Anggar.In aims to boost financial awareness, foster sustainable habits, and support informed decision-making, helping Indonesians navigate economic challenges and build long-term financial resilience.


**Cloud Computing:** 

In this capstone project, the cloud computing division plans to create a backend and cloud computing design using Node.js as API and Google Cloud to deploy the API and database. We initially planned to use cloud storage to store OCR results, cloud functions to run the API, Firestore as a NoSQL database, Compute Engine for ML computing, Cloud IAM to set up access to Google Cloud, Vertex AI to deploy and train ML, and the Google Cloud pricing calculator to estimate project costs. However, in the implementation, we didn't use everything as planned because using some services was sufficient.

# How to Use The Code
## Requirements
Before starting, make sure you have installed:

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
json
```
{
"message": "Registration successful, OTP sent to email"
}
```
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
json
```
{
"message": "OTP verified successfully"
}
```
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
json
```
{
"message": "OTP baru telah dikirim ke email Anda."
}
```
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
json
```
{ 
"message": "Login berhasil",
"token": "your_jwt_token"
}
```

### 5. Get User

- **URL**: `/:user_id`
- **Method**: `GET`
- **Response**:
json
```
{ "transactions": [ { "user_id": "user_id_value", "name": "user_name", "email": "user@example.com" } ] }
```

### 6. Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Authorization**:
  - `Bearer Token {{token}}`
- **Response**:
json
```
{
"message": "Logout successful"
}
```

### 7. Get User Profile

- **URL**: `/user/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"user_id": "user_id_value",
"fullname": "user_name",
"date_of_birth": "YYYY-MM-DD",
"phone_number": "1234567890" 
}
```

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
json
```
{ "fullname": "user_name",
"date_of_birth": "YYYY-MM-DD",
"phone_number": "1234567890"
}
```

### 9. Post Voice Input

- **URL**: `/voice-input`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
  - `category_id`: `your_category_id`
- **Request Body**:
```
{
  "fullTranscriptText": "ulhaq 100 hari yang lalu membeli apel afrika, kebun tebu, dan segalon air di juragan empang dengan total 5 miliar rupiah"
}
```
- **Response**:
json
```
{
"message": "Income recorded successfully",
"income_id": "income_id_value"
}
```

### 10. Post Receipt

- **URL**: `/upload-receipt`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Request Body**: (form-data)
  - `receipt`: (file)
- **Response**:
json
```
{ 
"message": "Receipt scanned and expense recorded successfully", 
"expense_id": "expense_id_value", 
"extracted_text": "extracted_text_value", 
"parsed_receipt": 
{ "company": 
"Company Name", 
"total": 
"Total Amount", 
"items": ["Item 1", "Item 2"] } 
}
```

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
json
```
{
"message": "Budget created successfully",
"budget_id": "budget_id_value"
}
```

### 12. Get Budget

- **URL**: `/budget/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"budget_id": "budget_id_value",
"user_id": "user_id_value",
"income_month": "1000000",
"budget_month": "800000"
} 
```

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
json
```
{ 
"message": "Budget updated successfully" 
}
```

### 14. Delete Budget

- **URL**: `/budget/:budget_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"message": "Budget deleted successfully"
}
```

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
json
```
{
"message": "Expense created successfully",
"expense_id": "expense_id_value"
}
```


### 16. Get Expense

- **URL**: `/expense/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{ 
"Expense_ID": "expense_id_value", 
"User_ID": "user_id_value", 
"Expense_amount": 50000, 
"Expense_date": "2024-12-01", 
"store": "Store Name", 
"items": ["Item 1", "Item 2"] 
} 
```

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
json
```
{
"message": "Expense updated successfully"
}
```

### 18. Delete Expense

- **URL**: `/expense/:expense_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"message": "Expense deleted successfully"
}
```

### 19. Get Category

- **URL**: `/category`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"category_id": "category_id_value",
"name": "Food",
"transaction_type": "expense"
}
```

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
json
```
{
"message": "Category created successfully",
"category_id": "category_id_value"
}
```

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
json
```
{
"message": "Category updated successfully"
}
```

### 22. Delete Category

- **URL**: `/category/:category_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"message": "Category deleted successfully"
}
```

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
json
```
{
"message": "Income created successfully",
"income_id": "income_id_value"
}
```

### 24. Get Income

- **URL**: `/income/:user_id`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"income_id": "income_id_value",
"user_id": "user_id_value",
"income_amount": 1000000,
"income_date": "2024-12-01",
"description": "Salary"
} 
```

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
json
```
{
"message": "Income updated successfully"
}
```

### 26. Delete Income

- **URL**: `/income/:income_id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Response**:
json
```
{
"message": "Income deleted successfully"
}
```

### 27. Get Report Analysis

- **URL**: `/report-analysis`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: `Bearer {{token}}`
- **Query Parameters**:
  - `period`: `daily`, `weekly`, or `monthly`
- **Response**:
json
```
{
"totalIncome": 1000000,
"totalExpense": 50000,
"netBalance": 950000,
"incomePercentage": "95.00",
"expensePercentage": "5.00",
"categories": [ { "name": "Food", "total_expense": 50000 } ]
}
```

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
json
```
{
"message": "Saving goals created successfully",
"goal_id": "goal_id_value"
}
```

### 29. Get Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `GET`
- **Response**:
json
```
{
"goal_id": "goal_id_value",
"user_id": "user_id_value",
"goal_name": "Save for Vacation",
"target_amount": 2000000,
"current_amount": 500000,
"start_date": "2024-01-01",
"goal_deadline": "2024-12-31"
}
```

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
json
```
{
"message": "Goal updated successfully"
}
```

### 31. Delete Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `DELETE`
- **Response**:
json
```
{
"message": "Goal deleted successfully"
}
```

### 31. Delete Financial Goals

- **URL**: `/financial-goals/:user_id/:goal_id`
- **Method**: `DELETE`
- **Response**:
json
```
{
"message": "Goal deleted successfully"
}
```

### 32. Investment Calculator Input

- **URL**: `https://ml-api-1067208185659.asia-southeast2.run.app/calculate-target-return`
- **Method**: `POST`
```
{
  "annualExpenditure": 50000000, 
    "initialInvestment": 100000000, 
    "timePeriod": 10
}
```
- **Response**:
```
{
    "targetPortfolio": "1250000000.00",
    "roi": 28.73,
    "targetReturn": 28.733329354522397
}
```

### 33. Investment Recomendation

- **URL**: `https://ml-api-1067208185659.asia-southeast2.run.app/recommendations`
- **Method**: `POST`
```
{
  "targetReturn": 28.73
}
```
- **Response**:
```
    {
        "stockCode": "LSIP",
        "revenue": "Rp 4.191.000.000.000",
        "netIncome": "Rp 1.108.000.000.000",
        "marketCap": "Rp 8.082.000.000.000",
        "annualEPS": 157.06,
        "returnOnEquity": 9.32,
        "oneYearPriceReturns": 30.22,
        "threeYearPriceReturns": 0.85,
        "fiveYearPriceReturns": -12.87,
        "dividendYield": 3.29,
        "payoutRatio": 24.83
    },
    {
        "stockCode": "UNTR",
        "revenue": "Rp 130.544.000.000.000",
        "netIncome": "Rp 20.855.000.000.000",
        "marketCap": "Rp 103.045.000.000.000",
        "annualEPS": 5573.22,
        "returnOnEquity": 24.35,
        "oneYearPriceReturns": 23.19,
        "threeYearPriceReturns": 21.7,
        "fiveYearPriceReturns": 33.45,
        "dividendYield": 8.09,
        "payoutRatio": 40.12
    }
```

### 34. Investment Prediction

- **URL**: `https://anggarin-api-invest-service-1067208185659.asia-southeast2.run.app/result/<stockcode>`
- **URL example**: `https://anggarin-api-invest-service-1067208185659.asia-southeast2.run.app/result/ADMF`
- **Method**: `GET`

- **Response**:
```
 {
        "timestamp": "2024-12-07",
        "low": "10061",
        "high": "10203",
        "close": "10144",
        "stockcode": "ADMF"
    },
    {
        "timestamp": "2024-12-08",
        "low": "10057",
        "high": "10199",
        "close": "10140",
        "stockcode": "ADMF"
    },
    {
        "timestamp": "2024-12-09",
        "low": "10051",
        "high": "10193",
        "close": "10134",
        "stockcode": "ADMF"
    },
}
```


# Other Path Documentation 
**Mobile Development:**
[Anggar.In Mobile Developments Repository](https://github.com/Anggar-In/Mobile-Development)

**Machine Learning:**
[Anggar.In Machine Learning Repository](https://github.com/Anggar-In/Machine-Learning)



