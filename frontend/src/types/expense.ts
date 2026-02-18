export interface Expense {
  id: string;
  amount: number; // stored in cents
  category: ExpenseCategory;
  description: string;
  date: string;
  created_at: string;
  idempotency_key: string | null;
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "bills"
  | "health"
  | "education"
  | "other";

export interface ExpenseFormData {
  amount: number; // user enters in rupees, hook converts to cents
  category: ExpenseCategory;
  description: string;
  date: Date;
}

export type SortOrder = "newest" | "oldest";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "bills", label: "Bills & Utilities" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

export const categoryColors: Record<ExpenseCategory, string> = {
  food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  transport: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  entertainment: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  shopping: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  bills: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  health: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  education: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};
