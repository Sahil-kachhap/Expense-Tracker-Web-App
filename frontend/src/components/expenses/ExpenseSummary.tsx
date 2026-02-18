import { formatCurrency } from "@/utils/currency";
import { IndianRupee } from "lucide-react";

interface ExpenseSummaryProps {
  total: number;
  count: number;
  isFiltered: boolean;
}

export function ExpenseSummary({ total, count, isFiltered }: ExpenseSummaryProps) {
  return (
    <div className="rounded-xl border bg-card p-5 summary-glow animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {isFiltered ? "Filtered Total" : "Total Expenses"}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
            {formatCurrency(total)}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <IndianRupee className="h-6 w-6 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {count} expense{count !== 1 ? "s" : ""}{isFiltered ? " (filtered)" : ""}
      </p>
    </div>
  );
}
