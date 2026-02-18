const { v4: uuidv4 } = require("uuid");

const {
  createExpense,
  getExpenses,
  deleteExpense,
  findByIdempotencyKey,
} = require("../models/expenseModel");

const createExpenseService = async (expenseData, idempotencyKeyHeader) => {
  if (expenseData.amount <= 0) {
    const error = new Error("Amount must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  const idempotencyKey = idempotencyKeyHeader || uuidv4();

  const existingExpense = await findByIdempotencyKey(idempotencyKey);

  if (existingExpense) {
    return existingExpense; // Return previously created record
  }

  const amountInCents = Math.round(expenseData.amount * 100);

  const payload = {
    amount: amountInCents,
    category: expenseData.category,
    description: expenseData.description,
    date: expenseData.date,
    idempotency_key: idempotencyKey,
  };

  try {
    const created = await createExpense(payload);
    return created;
  } catch (err) {
    // Handle duplicate unique constraint edge case
    if (err.code === "23505") {
      const existing = await findByIdempotencyKey(idempotencyKey);
      return existing;
    }

    throw err;
  }
};

const getExpensesService = async (filters) => {
  const result = await getExpenses(filters);

  // Convert cents → rupees
  const formattedExpenses = result.expenses.map((expense) => ({
    ...expense,
    amount: expense.amount / 100,
  }));

  const formattedTotal = result.total / 100;

  return {
    expenses: formattedExpenses,
    total: formattedTotal,
  };
};

const deleteExpenseService = async (id) => {
  if (!id) {
    const error = new Error("Expense ID required");
    error.statusCode = 400;
    throw error;
  }

  return await deleteExpense(id);
};

const getExpensesForExportService = async (filters) => {
  const result = await getExpenses(filters);

  return result.expenses.map((expense) => ({
    ...expense,
    amount: (expense.amount / 100).toFixed(2),
  }));
};

module.exports = {
  createExpenseService,
  getExpensesService,
  deleteExpenseService,
  getExpensesForExportService,
};
