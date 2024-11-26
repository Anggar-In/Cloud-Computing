<<<<<<< HEAD
require('dotenv').config(); 
=======
require("dotenv").config();
>>>>>>> f186631f2b34b20dafb1ea9ceee0cc95dc1e2931

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};
