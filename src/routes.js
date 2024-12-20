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
  resendOTP} = require('./controller');

  const { calculatorFreedom } = require('./stockRecommendation');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get("/:user_id", getUsers);
router.post('/auth/verify-otp', verifyOTP); 
router.post('/resend-otp', resendOTP);

router.post('/upload-receipt', auth, upload.single('receipt'), postReceipt);

router.post('/budget', auth, postBudget);
router.get('/budget/:user_id', auth, getBudget);
router.put('/budget/:budget_id', auth, putBudget);
router.delete('/budget/:budget_id', auth, deleteBudget);

router.post('/expense', auth, postExpense);
router.get('/expense/:user_id', auth, getExpense);
router.put('/expense/:expense_id', auth, putExpense);
router.delete('/expense/:expense_id', auth, deleteExpense);

router.get('/category', auth, getCategory);
router.post('/category', auth, postCategory);
router.put('/category/:category_id', auth, putCategory);
router.delete('/category/:category_id', auth, deleteCategory);

router.post('/income', auth, postIncome);
router.get('/income/:user_id', auth, getIncome);
router.put('/income/:income_id', auth, putIncome);
router.delete('/income/:income_id', auth, deleteIncome);

router.get('/user/profile', auth, getUserProfile);
router.put('/user/profile', auth, putUserProfile);

router.post('/voice-input', auth, postVoiceInput);

router.get('/report-analysis', auth, getReportAnalysis);

router.post("/financial-goals", auth, createFinanGoals);
router.get("/financial-goals/:goal_id", auth, getFinanGoals);
router.put("/financial-goals/:goal_id", auth, updateFinanGoals);
router.delete("/financial-goals/:goal_id", auth, deleteFinanGoals);

router.post('/calculate-roi', auth, calculatorFreedom);

module.exports = router;
