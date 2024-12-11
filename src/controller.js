const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./connect');
const { SECRET_KEY } = require('./config');
const { processImage } = require('../machine_learning/OCR_Receipt');
const SpeechToTextExtractor = require('../machine_learning/voiceInput');
const nodemailer = require('nodemailer');
require('dotenv').config();
const tokenBlacklist = new Set();

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code for Anggar.In - Financial Tracker',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 5px; max-width: 600px; margin: auto;">
        <div style="text-align: center; padding: 10px;">
          <h1 style="color: #4CAF50;">Welcome to Anggar.In!</h1>
          <img src="${process.env.LOGO_URL}" alt="Anggar.In Logo" style="width: 150px;"/>
        </div>
        <h2 style="color: #333;">Hello!</h2>
        <p>Thank you for registering with <strong>Anggar.In</strong>, your personal finance tracker.</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h1 style="font-size: 24px; color: #4CAF50; text-align: center; padding: 10px; border: 2px dashed #4CAF50; display: inline-block;">${otp}</h1>
        <p>Please enter this code in the application to complete your registration.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: 1px solid #ccc;">
        <p style="color: #777;">Best regards,<br>The Anggar.In Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

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

    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendOTP(email, otp);

    await db.query("INSERT INTO otp_verification (user_id, otp) VALUES (?, ?)", [userId, otp]);

    res.status(200).json({ message: "Registration successful, OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const db = await connectDB();
  const [results] = await db.query("SELECT * FROM otp_verification WHERE otp = ? AND user_id = (SELECT user_id FROM users WHERE email = ?)", [otp, email]);

  if (results.length > 0) {
    await db.query("UPDATE users SET verified = 1 WHERE email = ?", [email]);
    await db.query("DELETE FROM otp_verification WHERE user_id = (SELECT user_id FROM users WHERE email = ?)", [email]); // Remove OTP after verification
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;

  const db = await connectDB();
  const [userResults] = await db.query("SELECT * FROM users WHERE email = ?", [email]);


  if (userResults.length === 0) {
    return res.status(400).json({ message: "Email tidak terdaftar" });
  }

  const user = userResults[0]; 

  if (user.verified) {
    return res.status(400).json({ message: "Akun Anda sudah terverifikasi." });
  }

  const [otpResults] = await db.query("SELECT * FROM otp_verification WHERE user_id = ?", [user.user_ID]);

  if (otpResults.length > 0) {
    const lastSentAt = new Date(otpResults[0].sent_at);
    const now = new Date();
    const timeDiff = (now - lastSentAt) / 1000;

    if (timeDiff < 60) {
      return res.status(400).json({ message: "Tunggu 1 menit sebelum mengirim ulang OTP." });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  await sendOTP(email, otp);

  if (otpResults.length > 0) {
    await db.query("UPDATE otp_verification SET otp = ?, sent_at = ? WHERE user_id = ?", [otp, new Date(), user.user_ID]);
  } else {
    await db.query("INSERT INTO otp_verification (user_id, otp, sent_at) VALUES (?, ?, ?)", [user.user_ID, otp, new Date()]);
  }

  res.status(200).json({ message: "OTP baru telah dikirim ke email Anda." });
};


// Login API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectDB();

    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Email tidak terdaftar" });
    }

    const user = results[0];

    if (!user.verified) {
      return res.status(403).json({ message: "Akun Anda belum terverifikasi. Silakan periksa email Anda untuk OTP." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign({ user_ID: user.user_ID }, SECRET_KEY);

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: "Token telah dibatalkan. Silakan login kembali." });
    }

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// LOGOUT API
const logout = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: "Token tidak ditemukan" });
    }
    
    tokenBlacklist.add(token);

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat logout", error: error.message });
  }
};


const checkTokenBlacklist = (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1];

  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token telah dibatalkan. Silakan login kembali." });
  }

  next();
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

const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user_id; 
    const db = await connectDB();

    const query = 'SELECT * FROM user_profile WHERE user_id = ?';
    const [results] = await db.query(query, [user_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(results[0]); 
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

const putUserProfile = async (req, res) => {
  try {
    const user_id = req.user_id; 
    const { fullname, date_of_birth, phone_number } = req.body; 
    const db = await connectDB();

    const query = 'UPDATE user_profile SET fullname = ?, date_of_birth = ?, phone_number = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?';
    const values = [fullname, date_of_birth, phone_number, user_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};


// POST OCR API 
const postReceipt = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const { text, receipt } = await processImage(fileBuffer); 

    const db = await connectDB();
    const expense_id = uuidv4();
    const user_id = req.user_id; 
    const category_id = req.body.category_id; 
    const expense_amount = parseFloat(receipt.total.replace(/\./g, '').replace(',', '.')); 
    const expense_date = receipt.date ? new Date(receipt.date.split('-').reverse().join('-')) : new Date();

    const [categoryCheck] = await db.query('SELECT * FROM category WHERE category_id = ?', [category_id]);
    if (categoryCheck.length === 0) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const query = `INSERT INTO expense (Expense_ID, User_ID, Category_ID, Expense_amount, Expense_date, store, items) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [expense_id, user_id, category_id, expense_amount, expense_date, receipt.company, JSON.stringify(receipt.items)];

    await db.query(query, values);

    res.status(200).json({
      message: 'Receipt scanned and expense recorded successfully',
      expense_id,
      extracted_text: text,
      parsed_receipt: receipt,  
    });
  } catch (error) {
    res.status(500).json({ message: 'Error scanning receipt', error: error.message });
  }
};

// POST VOICE INPUT API
const postVoiceInput = async (req, res) => {
  try {
      const { fullTranscriptText } = req.body;
      const user_id = req.user_id; 
      const db = await connectDB();
      const category_id = req.headers['category_id']; 
      const extractor = new SpeechToTextExtractor();
      const extractedData = extractor.extractData(fullTranscriptText);

      let transactionType;
      if (extractedData && extractedData.Type === 'Pengeluaran') {
          transactionType = 'expense';
      } else if (extractedData && extractedData.Type === 'Pemasukan') {
          transactionType = 'income';
      } else {
          return res.status(400).json({ message: 'Invalid transaction type detected' });
      }

      if (transactionType === 'expense') {
          const expense_id = uuidv4();
          const { Total, Date: rawDate, Items, Company } = extractedData;

          console.log("Final Date for Insertion:", date); 

          const query = `INSERT INTO expense (Expense_ID, User_ID, Category_ID, Expense_amount, Expense_date, store, items) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const values = [expense_id, user_id, category_id, Total, date, Company, JSON.stringify(Items)];

          await db.query(query, values);
          res.status(201).json({ message: 'Expense recorded successfully', expense_id });
      } else if (transactionType === 'income') {
          const income_id = uuidv4();
          const { Total, Date: rawDate, Company } = extractedData;

          console.log("Final Date for Insertion:", date);

          const query = `INSERT INTO income (income_id, user_id, category_id, income_amount, income_date, description) VALUES (?, ?, ?, ?, ?, ?)`;
          const values = [income_id, user_id, category_id, Total, date, Company];

          await db.query(query, values);
          res.status(201).json({ message: 'Income recorded successfully', income_id });
      }
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: 'Database error', error: error.message });
  }
};


// POST BUDGET API
const postBudget = async (req, res) => {
  try {
    const { income_month, budget_month } = req.body;
    const user_id = req.user_id; 
    const db = await connectDB();
    const budget_id = uuidv4();

    const query = 'INSERT INTO budget_tools (budget_id, user_id, income_month, budget_month) VALUES (?, ?, ?, ?)';
    const values = [budget_id, user_id, income_month, budget_month];

    await db.query(query, values);
    res.status(201).json({ message: 'Budget created successfully', budget_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};


// GET BUDGET API
const getBudget = async (req, res) => {
  try {
    const user_id = req.user_id; 
    const db = await connectDB();

    const query = 'SELECT * FROM budget_tools WHERE user_id = ?';
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
    const user_id = req.user_id; 
    const { income_month, budget_month } = req.body; 

    const query = 'UPDATE budget_tools SET income_month = ?, budget_month = ? WHERE budget_id = ? AND user_id = ?';
    const values = [income_month, budget_month, budget_id, user_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Budget not found or not owned by user' });
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
    const user_id = req.user_id; 
    const db = await connectDB();

    const query = 'DELETE FROM budget_tools WHERE budget_id = ? AND user_id = ?';
    const [result] = await db.query(query, [budget_id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Budget not found or not owned by user' });
    }

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// POST EXPENSE API
const postExpense = async (req, res) => {
  try {
    const { expense_amount, expense_date, store, items } = req.body;
    const user_id = req.user_id; 
    const category_id = req.headers['category_id'];
    const db = await connectDB();
    const expense_id = uuidv4();

    // Validasi category_id
    const [categoryCheck] = await db.query('SELECT transaction_type FROM category WHERE category_id = ?', [category_id]);
    if (categoryCheck.length === 0 || categoryCheck[0].transaction_type !== 'expense') {
      return res.status(400).json({ message: 'Invalid category for expense' });
    }

    // Query untuk menyimpan pengeluaran
    const query = 'INSERT INTO expense (Expense_ID, User_ID, category_id, Expense_amount, Expense_date, store, items) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [expense_id, user_id, category_id, expense_amount, expense_date, store, JSON.stringify(items)];

    await db.query(query, values);
    res.status(201).json({ message: 'Expense created successfully', expense_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// GET EXPENSE API
const getExpense = async (req, res) => {
  try {
    const user_id = req.user_id;
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
    const { expense_amount, expense_date, store, items } = req.body; 
    const category_id = req.headers['category_id'];
    const db = await connectDB();

    const [categoryCheck] = await db.query('SELECT transaction_type FROM category WHERE category_id = ?', [category_id]);
    if (categoryCheck.length === 0 || categoryCheck[0].transaction_type !== 'expense') {
      return res.status(400).json({ message: 'Invalid category for expense' });
    }

    const query = 'UPDATE expense SET Expense_amount = ?, Expense_date = ?, store = ?, items = ?, category_id = ? WHERE Expense_ID = ?';
    const values = [expense_amount, expense_date, store, JSON.stringify(items), category_id, expense_id];

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

// GET CATEGORY API
const getCategory = async (req, res) => {
  try {
    const db = await connectDB();
    const query = 'SELECT * FROM category WHERE transaction_type = "expense"';
    const [results] = await db.query(query);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// POST CATEGORY API
const postCategory = async (req, res) => {
  try {
    const { name, transaction_type } = req.body; 
    const db = await connectDB();
    const category_id = uuidv4();

    const query = 'INSERT INTO category (category_id, name, transaction_type) VALUES (?, ?, ?)';
    const values = [category_id, name, transaction_type];

    await db.query(query, values);
    res.status(201).json({ message: 'Category created successfully', category_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// PUT CATEGORY API
const putCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name } = req.body;
    const db = await connectDB();

    const query = 'UPDATE category SET name = ? WHERE category_id = ?';
    const values = [name, category_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// DELETE CATEGORY API
const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const db = await connectDB();

    const query = 'DELETE FROM category WHERE category_id = ?';
    const [result] = await db.query(query, [category_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// POST INCOME API
const postIncome = async (req, res) => {
  try {
    const { income_amount, income_date, description } = req.body; 
    const user_id = req.user_id; 
    const category_id = req.headers['category_id']; 
    const db = await connectDB();
    const income_id = uuidv4();

    const [categoryCheck] = await db.query('SELECT transaction_type FROM category WHERE category_id = ?', [category_id]);
    if (categoryCheck.length === 0 || categoryCheck[0].transaction_type !== 'income') {
      return res.status(400).json({ message: 'Invalid category for income' });
    }

    const query = 'INSERT INTO income (income_id, user_id, category_id, income_amount, income_date, description) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [income_id, user_id, category_id, income_amount, income_date, description];

    await db.query(query, values);
    res.status(201).json({ message: 'Income created successfully', income_id });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// GET INCOME API
const getIncome = async (req, res) => {
  try {
    const user_id = req.user_id; 
    const db = await connectDB();

    const query = 'SELECT * FROM income WHERE user_id = ?';
    const [results] = await db.query(query, [user_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No income records found for this user' });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// PUT INCOME API
const putIncome = async (req, res) => {
  try {
    const { income_id } = req.params;
    const { income_amount, income_date, description } = req.body;
    const category_id = req.headers['category_id'];
    const db = await connectDB();

    const [categoryCheck] = await db.query('SELECT transaction_type FROM category WHERE category_id = ?', [category_id]);
    if (categoryCheck.length === 0 || categoryCheck[0].transaction_type !== 'income') {
      return res.status(400).json({ message: 'Invalid category for income' });
    }

    const query = 'UPDATE income SET category_id = ?, income_amount = ?, income_date = ?, description = ? WHERE income_id = ?';
    const values = [category_id, income_amount, income_date, description, income_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// DELETE INCOME API
const deleteIncome = async (req, res) => {
  try {
    const { income_id } = req.params;
    const db = await connectDB();

    const query = 'DELETE FROM income WHERE income_id = ?';
    const [result] = await db.query(query, [income_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

const getReportAnalysis = async (req, res) => {
  try {
    const user_id = req.user_id; 
    const { period } = req.query;
    const db = await connectDB();

    let expenseQuery;
    let values = [user_id];

    if (period === 'daily') {
      expenseQuery = `
        SELECT 
          DATE(e.Expense_date) AS report_date,
          SUM(e.Expense_amount) AS total_expense
        FROM expense e
        WHERE e.user_id = ?
        GROUP BY report_date
      `;
    } else if (period === 'weekly') {
      expenseQuery = `
        SELECT 
          DATE(e.Expense_date) AS report_date,
          SUM(e.Expense_amount) AS total_expense
        FROM expense e
        WHERE e.user_id = ?
        GROUP BY report_date
      `;
    } else if (period === 'monthly') {
      expenseQuery = `
        SELECT 
          DATE_FORMAT(e.Expense_date, '%Y-%m') AS report_date,
          SUM(e.Expense_amount) AS total_expense
        FROM expense e
        WHERE e.user_id = ?
        GROUP BY report_date
      `;
    } else {
      return res.status(400).json({ message: 'Invalid period specified' });
    }

    const [expenseResults] = await db.query(expenseQuery, values);

    const incomeQuery = `
      SELECT 
        DATE(income_date) AS report_date,
        SUM(income_amount) AS total_income
      FROM income
      WHERE user_id = ?
      GROUP BY report_date
    `;
    const [incomeResults] = await db.query(incomeQuery, values);

    const totalIncome = incomeResults.reduce((acc, curr) => acc + (parseFloat(curr.total_income) || 0), 0);
    const totalExpense = expenseResults.reduce((acc, curr) => acc + (parseFloat(curr.total_expense) || 0), 0);
    const netBalance = totalIncome - totalExpense;

    const incomePercentage = totalIncome > 0 ? ((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(2) : 0;
    const expensePercentage = totalExpense > 0 ? ((totalExpense / (totalIncome + totalExpense)) * 100).toFixed(2) : 0;

    const categoryQuery = `
      SELECT c.name, SUM(e.Expense_amount) AS total_expense
      FROM expense e
      JOIN category c ON e.category_id = c.category_id
      WHERE e.user_id = ?
      GROUP BY c.name
      ORDER BY total_expense DESC
      LIMIT 5
    `;
    const [categoryResults] = await db.query(categoryQuery, [user_id]);

    let response = {
      totalIncome,
      totalExpense,
      netBalance,
      incomePercentage,
      expensePercentage,
      categories: categoryResults
    };

    if (period === 'daily') {
      const dailyExpenses = {};
      const dailyIncome = {};
      expenseResults.forEach(result => {
        dailyExpenses[result.report_date] = parseFloat(result.total_expense) || 0;
      });
      incomeResults.forEach(result => {
        dailyIncome[result.report_date] = parseFloat(result.total_income) || 0;
      });
      response.daily_expenses = dailyExpenses;
      response.daily_income = dailyIncome;
    } else if (period === 'weekly') {
      const weeklyExpenses = {};
      const weeklyIncome = {};
      
      expenseResults.forEach(result => {
        const date = new Date(result.report_date);
        const weekNumber = Math.ceil(date.getDate() / 7);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const key = `${monthName} week ${weekNumber}`;
        weeklyExpenses[key] = (weeklyExpenses[key] || 0) + (parseFloat(result.total_expense) || 0);
      });
      
      incomeResults.forEach(result => {
        const date = new Date(result.report_date);
        const weekNumber = Math.ceil(date.getDate() / 7);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const key = `${monthName} week ${weekNumber}`;
        weeklyIncome[key] = (weeklyIncome[key] || 0) + (parseFloat(result.total_income) || 0);
      });
      
      response.weekly_expenses = weeklyExpenses;
      response.weekly_income = weeklyIncome;
    } else if (period === 'monthly') {
      const monthlyExpenses = {};
      const monthlyIncome = {};
      
      expenseResults.forEach(result => {
        const date = new Date(result.report_date);
        const monthName = date.toLocaleString('default', { month: 'long' });
        monthlyExpenses[monthName] = (monthlyExpenses[monthName] || 0) + (parseFloat(result.total_expense) || 0);
      });
      
      incomeResults.forEach(result => {
        const date = new Date(result.report_date);
        const monthName = date.toLocaleString('default', { month: 'long' });
        monthlyIncome[monthName] = (monthlyIncome[monthName] || 0) + (parseFloat(result.total_income) || 0);
      });
      
      response.monthly_expenses = monthlyExpenses;
      response.monthly_income = monthlyIncome;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
};

// POST FINANCIAL GOALS API
const createFinanGoals = async (req, res) => {
  try {
    const { goal_name, target_amount, current_amount, start_date, goal_deadline } = req.body;
    const user_id = req.user_id; 
    const goal_id = uuidv4();
    const db = await connectDB();

    const query = "INSERT INTO saving_financial_goals (goal_id, user_id, goal_name, target_amount, current_amount, start_date, goal_deadline) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [goal_id, user_id, goal_name, target_amount, current_amount, start_date, goal_deadline];

    await db.query(query, values);
    res.status(201).json({ message: "Saving goals created successfully", goal_id });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// GET FINANCIAL GOALS API
const getFinanGoals = async (req, res) => {
  try {
    const { goal_id } = req.params;
    const user_id = req.user_id;
    const db = await connectDB();

    const query = "SELECT * FROM saving_financial_goals WHERE goal_id = ? AND user_id = ?";
    const [results] = await db.query(query, [goal_id, user_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// PUT FINANCIAL GOALS API
const updateFinanGoals = async (req, res) => {
  try {
    const { goal_id } = req.params; 
    const { goal_name, target_amount, current_amount, start_date, goal_deadline } = req.body;
    const user_id = req.user_id; 
    const db = await connectDB();

    const query = "UPDATE saving_financial_goals SET goal_name = ?, target_amount = ?, current_amount = ?, start_date = ?, goal_deadline = ? WHERE goal_id = ? AND user_id = ?";
    const values = [goal_name, target_amount, current_amount, start_date, goal_deadline, goal_id, user_id];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// DELETE FINANCIAL GOALS API
const deleteFinanGoals = async (req, res) => {
  try {
    const { goal_id } = req.params;
    const user_id = req.user_id; 
    const db = await connectDB();

    const query = "DELETE FROM saving_financial_goals WHERE goal_id = ? AND user_id = ?";
    const [result] = await db.query(query, [goal_id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

module.exports = { register, 
  login, 
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
  getCategory, 
  postCategory, 
  putCategory, 
  deleteCategory, 
  postIncome, 
  getIncome, 
  putIncome, 
  deleteIncome, 
  putUserProfile, 
  getUserProfile, 
  getReportAnalysis, 
  getUsers, 
  createFinanGoals, 
  getFinanGoals, 
  updateFinanGoals, 
  deleteFinanGoals, 
  postVoiceInput, 
  verifyOTP,
  resendOTP, checkTokenBlacklist };
