const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const connectDB = require("./connect");
const { SECRET_KEY } = require('./config');
const { processImage } = require('../machine_learning/OCR_Receipt');

// Register API
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = await connectDB();
    
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const query = "INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?)";
    const values = [userId, name, email, hashedPassword];

    await db.query(query, values);
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectDB();

    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {

  res.status(200).json({ message: "Logout successful" });
};

//GET users
const getUsers = async (req, res) => {
    const { user_id } = req.params;
    const db = await connectDB();
  
    db.query("SELECT * FROM users WHERE user_id = ?", [user_id], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(200).json({ transactions: results });
    });
  };

// Transaction POST API
const postTransaction = async (req, res) => {
  try {
    const { category_id, user_id, amount, date, description } = req.body;
    const transaction_id = uuidv4();
    const db = await connectDB();

    const query = 'INSERT INTO transaction (transaction_id, category_id, user_id, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [transaction_id, category_id, user_id, amount, date, description];

    await db.query(query, values);
    res.status(201).json({ message: 'Transaction added successfully', transaction_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
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

// POST BUDGET API
const postBudget = async (req, res) => {
  try {
    const { user_id, budget_name, total_amount, start_date, end_date } = req.body;
    const budget_id = uuidv4();
    const db = await connectDB();

    const query = 'INSERT INTO budget_tools (Budget_ID, User_ID, Budget_Name, total_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [budget_id, user_id, budget_name, total_amount, start_date, end_date];

    await db.query(query, values);
    res.status(201).json({ message: 'Budget created successfully', budget_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// GET BUDGET API
const getBudget = async (req, res) => {
  try {
    const { user_id } = req.params;
    const db = await connectDB();

    const query = 'SELECT * FROM budget_tools WHERE User_ID = ?';
    const [results] = await db.query(query, [user_id]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// PUT BUDGET API
const putBudget = async (req, res) => {
  try {
    const { budget_id } = req.params;
    const { budget_name, total_amount, start_date, end_date } = req.body;
    const db = await connectDB();

    const query = 'UPDATE budget_tools SET Budget_Name = ?, total_amount = ?, start_date = ?, end_date = ? WHERE Budget_ID = ?';
    const values = [budget_name, total_amount, start_date, end_date, budget_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// DELETE BUDGET API
const deleteBudget = async (req, res) => {
  try {
    const { budget_id } = req.params;
    const db = await connectDB();

    const query = 'DELETE FROM budget_tools WHERE Budget_ID = ?';
    const [result] = await db.query(query, [budget_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// POST EXPENSE API
const postExpense = async (req, res) => {
  try {
    const { user_id, category_id, expense_amount, expense_date, description } = req.body;
    const expense_id = uuidv4();
    const db = await connectDB();

    const query = 'INSERT INTO expense (Expense_ID, User_ID, Category_ID, Expense_amount, Expense_date, Description) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [expense_id, user_id, category_id, expense_amount, expense_date, description];

    await db.query(query, values);
    res.status(201).json({ message: 'Expense created successfully', expense_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// GET EXPENSE API
const getExpense = async (req, res) => {
  try {
    const { user_id } = req.params;
    const db = await connectDB();

    const query = 'SELECT * FROM expense WHERE User_ID = ?';
    const [results] = await db.query(query, [user_id]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// PUT EXPENSE API
const putExpense = async (req, res) => {
  try {
    const { expense_id } = req.params;
    const { category_id, expense_amount, expense_date, description } = req.body;
    const db = await connectDB();

    const query = 'UPDATE expense SET Category_ID = ?, Expense_amount = ?, Expense_date = ?, Description = ? WHERE Expense_ID = ?';
    const values = [category_id, expense_amount, expense_date, description, expense_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// DELETE EXPENSE API
const deleteExpense = async (req, res) => {
  try {
    const { expense_id } = req.params;
    const db = await connectDB();

    const query = 'DELETE FROM expense WHERE Expense_ID = ?';
    const [result] = await db.query(query, [expense_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

module.exports = { register, 
  login, 
  postTransaction, 
  postReceipt, 
  postBudget, 
  getBudget, 
  putBudget, 
  deleteBudget, 
  logout, 
  postExpense, 
  getExpense, 
  putExpense, 
  deleteExpense,
  getUsers };
