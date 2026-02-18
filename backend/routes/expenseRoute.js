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
/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *               - description
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               category:
 *                 type: string
 *                 example: Food
 *               description:
 *                 type: string
 *                 example: Lunch
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-19
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
router.post('/', validateExpense, createExpense);

// Get expenses (with filters)
/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses with optional filters
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get('/', getExpenses);

// Export expenses
/**
 * @swagger
 * /api/expenses/export:
 *   get:
 *     summary: Export expenses as CSV or Excel
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, excel]
 *     responses:
 *       200:
 *         description: File download
 */
router.get('/export', exportExpenses);

// Delete expense
/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete('/:id', deleteExpense);

module.exports = router;
