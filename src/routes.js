const express = require("express");
const router = express.Router();
const {
  register,
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
  getUsers,
  createFinanGoals,
  getFinanGoals,
  updateFinanGoals,
  deleteFinanGoals,
} = require("./controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/transaction", postTransaction);
router.post("/upload-receipt", upload.single("receipt"), postReceipt);
router.post("/budget", postBudget);
router.post("/auth/logout", logout);
router.post("/expense", postExpense);
router.post("/financial-goals", createFinanGoals);

router.get("/:user_id", getUsers);
router.get("/budgets/:user_id", getBudget);
router.get("/expenses/:user_id", getExpense);
router.get("/financial-goals/:user_id/:goal_id", getFinanGoals);

router.put("/budget/:budget_id", putBudget);
router.put("/expense/:expense_id", putExpense);
router.put("/financial-goals/:user_id/:goal_id", updateFinanGoals);

router.delete("/budget/:budget_id", deleteBudget);
router.delete("/expense/:expense_id", deleteExpense);
router.delete("/financial-goals/:user_id/:goal_id", deleteFinanGoals);

module.exports = router;
