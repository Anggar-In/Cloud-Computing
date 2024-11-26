<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { register, login, postTransaction, postReceipt } = require('./controller'); 

const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/transaction', postTransaction);
router.post('/upload-receipt', upload.single('receipt'), postReceipt);
=======
const express = require("express");
const router = express.Router();
const { register, login, Transaction } = require("./controller");

router.post("/auth/register", register);

router.post("/auth/login", login);

router.post("/transaction", Transaction);
>>>>>>> f186631f2b34b20dafb1ea9ceee0cc95dc1e2931

module.exports = router;
