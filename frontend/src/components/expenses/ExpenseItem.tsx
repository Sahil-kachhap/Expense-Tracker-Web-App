import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { EXPENSE_CATEGORIES, categoryColors } from "@/types/expense";
import type { Expense } from "@/types/expense";

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const categoryLabel =
    EXPENSE_CATEGORIES.find((c) => c.value === expense.category)?.label ?? expense.category;

  return (
    <div className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-shadow hover:expense-card-shadow-hover animate-slide-in">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium text-card-foreground">
            {expense.description}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              categoryColors[expense.category]
            )}
          >
            {categoryLabel}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {format(new Date(expense.date), "MMM d, yyyy")}
        </p>
      </div>
      <span className="whitespace-nowrap text-sm font-semibold text-card-foreground">
        {formatCurrency(expense.amount)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        onClick={() => onDelete(expense.id)}
        aria-label="Delete expense"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
