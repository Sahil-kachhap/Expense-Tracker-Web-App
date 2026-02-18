const express = require('express');
const router = express.Router();
const validateExpense = require('../middlewares/validateExpense');


const {
  createExpense,
  getExpenses,
  deleteExpense,
  exportExpenses
} = require('../controllers/expenseController');


// Create expense
router.post('/', validateExpense, createExpense);

// Get expenses (with filters)
router.get('/', getExpenses);

// Export expenses
router.get('/export', exportExpenses);

// Delete expense
router.delete('/:id', deleteExpense);

module.exports = router;
