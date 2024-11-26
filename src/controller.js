const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./connect');
const { SECRET_KEY } = require('./config');
const { processImage } = require('../machine_learning/OCR_Receipt');

// Register API
const register = async (req, res) => {
  const { name, email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const query = "INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)";
    const values = [userId, name, email, hashedPassword];

    db.query(query, values, (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(200).json({ message: "Registration successful" });
    });
  });
};

// Login API
const login = async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(400).json({ message: "Email not registered" });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
  });
};

// Transaction POST API
const postTransaction = (req, res) => {
  const { category_id, user_id, amount, date, description } = req.body;

  const transaction_id = uuidv4();
  db.query(
    'INSERT INTO transaction (transaction_id, category_id, user_id, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)',
    [transaction_id, category_id, user_id, amount, date, description],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(201).json({ message: 'Transaction added successfully', transaction_id });
    }
  );
};

// POST OCR API 
const postReceipt = async (req, res) => {
  try {
      const receiptId = uuidv4();
      const fileBuffer = req.file.buffer;
      const { text, receipt } = await processImage(fileBuffer); 
      
      const db = await connectDB();
      const query = `INSERT INTO receipt_input (receipt_id, extracted_text) VALUES (?, ?)`;
      const values = [receiptId, text];
      await db.query(query, values);

      res.status(200).json({
          message: 'Receipt scanned successfully',
          receipt_id: receiptId,
          extracted_text: text,
          parsed_receipt: receipt,  
      });
  } catch (error) {
      res.status(500).json({ message: 'Error scanning receipt', error: error.message });
  }
};

module.exports = { register, login, postTransaction, postReceipt };
