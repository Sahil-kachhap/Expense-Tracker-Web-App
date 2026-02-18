const { z } = require("zod");

// Define schema
const expenseSchema = z.object({
  amount: z.coerce
    .number({ required_error: "Amount is required" })
    .positive("Amount must be greater than 0"),

  category: z
    .string({
      required_error: "Category is required",
    })
    .min(1, "Category cannot be empty"),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, "Description cannot be empty"),

  date: z
    .string({
      required_error: "Date is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid ISO string",
    }),
});

// Middleware function
const validateExpense = (req, res, next) => {
  try {
    expenseSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((err) => err.message),
    });
  }
};

module.exports = validateExpense;
