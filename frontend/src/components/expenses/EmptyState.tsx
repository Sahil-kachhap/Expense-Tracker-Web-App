import { Receipt, SearchX } from "lucide-react";

interface EmptyStateProps {
  isFiltered: boolean;
}

export function EmptyState({ isFiltered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 py-16 text-center animate-fade-in">
      {isFiltered ? (
        <>
          <SearchX className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-sm font-medium text-card-foreground">No matching expenses</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try changing your filter to see more results.
          </p>
        </>
      ) : (
        <>
          <Receipt className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-sm font-medium text-card-foreground">No expenses yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first expense using the form above.
          </p>
        </>
      )}
    </div>
  );
}
