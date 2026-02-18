const {
  createExpenseService,
  getExpensesService,
  deleteExpenseService,
  getExpensesForExportService,
} = require("../services/expenseService");

const ExcelJS = require("exceljs");

const createExpense = async (req, res, next) => {
  try {
    const idempotencyKey = req.header("Idempotency-Key");

    const createdExpense = await createExpenseService(req.body, idempotencyKey);

    res.status(201).json({
      success: true,
      data: createdExpense,
    });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      sort: req.query.sort || "desc",
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getExpensesService(filters);

    res.status(200).json({
      success: true,
      expenses: result.expenses,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await deleteExpenseService(id);

    res.status(200).json({
      success: true,
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

const exportExpenses = async (req, res, next) => {
  try {
    const format = req.query.format || "csv";

    const filters = {
      category: req.query.category,
      sort: req.query.sort || "desc",
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const expenses = await getExpensesForExportService(filters);

    if (format === "csv") {
      return exportCSV(res, expenses);
    }

    if (format === "excel") {
      return exportExcel(res, expenses);
    }

    res.status(400).json({
      success: false,
      message: "Invalid export format",
    });
  } catch (error) {
    next(error);
  }
};

const exportCSV = (res, expenses) => {
  const headers = ["Date", "Category", "Description", "Amount"];

  const rows = expenses.map(
    (e) => `${e.date},${e.category},${e.description},₹${e.amount}`
  );

  const csvContent = [headers.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");

  return res.send(csvContent);
};

const exportExcel = async (res, expenses) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Expenses");

  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Description", key: "description", width: 30 },
    { header: "Amount", key: "amount", width: 15 },
  ];

  expenses.forEach((expense) => {
    worksheet.addRow({
      ...expense,
      amount: `₹${expense.amount}`,
    });
  });

  // Bold header
  worksheet.getRow(1).font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = {
  createExpense,
  getExpenses,
  deleteExpense,
  exportExpenses,
};
