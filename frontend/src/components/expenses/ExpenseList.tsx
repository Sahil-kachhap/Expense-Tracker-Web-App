import type { Expense } from "@/types/expense";
import { ExpenseItem } from "./ExpenseItem";
import { EmptyState } from "./EmptyState";

interface ExpenseListProps {
  expenses: Expense[];
  isFiltered: boolean;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, isFiltered, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <EmptyState isFiltered={isFiltered} />;
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  );
}
