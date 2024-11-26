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

module.exports = router;
