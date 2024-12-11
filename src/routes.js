const express = require('express');
const router = express.Router();
const auth = require('./auth'); 
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const {
  register,
  login,
  logout,
  postReceipt,
  postBudget,
  getBudget,
  putBudget,
  deleteBudget,
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
  getUserProfile,
  postVoiceInput, 
  putUserProfile, 
  getReportAnalysis, 
  getUsers, 
  createFinanGoals,
  getFinanGoals,
  updateFinanGoals,
  deleteFinanGoals,
  verifyOTP, 
  resendOTP, checkTokenBlacklist} = require('./controller');

  const { calculatorFreedom } = require('./stockRecommendation');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get("/:user_id", getUsers);
router.post('/auth/verify-otp', verifyOTP); 
router.post('/resend-otp', resendOTP);

router.post('/upload-receipt', auth, checkTokenBlacklist, upload.single('receipt'), postReceipt);

router.post('/budget', auth, checkTokenBlacklist, postBudget);
router.get('/budget/:user_id', auth, checkTokenBlacklist, getBudget);
router.put('/budget/:budget_id', auth, checkTokenBlacklist, putBudget);
router.delete('/budget/:budget_id', auth, checkTokenBlacklist, deleteBudget);

router.post('/expense', auth, checkTokenBlacklist, postExpense);
router.get('/expense/:user_id', auth, checkTokenBlacklist, getExpense);
router.put('/expense/:expense_id', auth, checkTokenBlacklist, putExpense);
router.delete('/expense/:expense_id', auth, checkTokenBlacklist, deleteExpense);

router.get('/category', auth, checkTokenBlacklist, getCategory);
router.post('/category', auth, checkTokenBlacklist, postCategory);
router.put('/category/:category_id', auth, checkTokenBlacklist, putCategory);
router.delete('/category/:category_id', auth, checkTokenBlacklist, deleteCategory);

router.post('/income', auth, checkTokenBlacklist, postIncome);
router.get('/income/:user_id', auth, checkTokenBlacklist, getIncome);
router.put('/income/:income_id', auth, checkTokenBlacklist, putIncome);
router.delete('/income/:income_id', auth, checkTokenBlacklist, deleteIncome);

router.get('/user/profile', auth, checkTokenBlacklist, getUserProfile);
router.put('/user/profile', auth, checkTokenBlacklist, putUserProfile);

router.post('/voice-input', auth, checkTokenBlacklist, postVoiceInput);

router.get('/report-analysis', auth, checkTokenBlacklist, getReportAnalysis);

router.post("/financial-goals", auth, checkTokenBlacklist, createFinanGoals);
router.get("/financial-goals/:goal_id", auth, checkTokenBlacklist, getFinanGoals);
router.put("/financial-goals/:goal_id", auth, checkTokenBlacklist, updateFinanGoals);
router.delete("/financial-goals/:goal_id", auth, checkTokenBlacklist, deleteFinanGoals);

router.post('/calculate-roi', auth, checkTokenBlacklist, calculatorFreedom);

module.exports = router;
