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
