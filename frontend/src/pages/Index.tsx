import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/hooks/use-toast";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExportButton } from "@/components/expenses/ExportButton";

const Index = () => {
  const {
    expenses,
    total,
    isAdding,
    addExpense,
    deleteExpense,
    filterCategory,
    setFilterCategory,
    sortOrder,
    setSortOrder,
    hasExpenses,
    isFiltered,
  } = useExpenses();

  const { toast } = useToast();

  const handleSubmit = async (data: Parameters<typeof addExpense>[0]) => {
    await addExpense(data);
    toast({ title: "Expense added", description: "Your expense has been recorded." });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Expense Tracker
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and manage your daily expenses
            </p>
          </div>
          {hasExpenses && (
            <ExportButton filterCategory={filterCategory} sortOrder={sortOrder} />
          )}
        </header>

        <div className="space-y-6">
          <ExpenseForm onSubmit={handleSubmit} isSubmitting={isAdding} />

          <ExpenseSummary total={total} count={expenses.length} isFiltered={isFiltered} />

          {hasExpenses && (
            <ExpenseFilters
              filterCategory={filterCategory}
              onFilterChange={setFilterCategory}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          )}

          <ExpenseList expenses={expenses} isFiltered={isFiltered} onDelete={deleteExpense} />
        </div>
      </div>
    </div>
  );
};

export default Index;
