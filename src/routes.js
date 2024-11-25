const express = require("express");
const router = express.Router();
const { register, login, Transaction } = require("./controller");

router.post("/auth/register", register);

router.post("/auth/login", login);

router.post("/transaction", Transaction);

module.exports = router;
