import { ArrowDownUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import type { ExpenseCategory, SortOrder } from "@/types/expense";

interface ExpenseFiltersProps {
  filterCategory: ExpenseCategory | "all";
  onFilterChange: (value: ExpenseCategory | "all") => void;
  sortOrder: SortOrder;
  onSortChange: (value: SortOrder) => void;
}

export function ExpenseFilters({
  filterCategory,
  onFilterChange,
  sortOrder,
  onSortChange,
}: ExpenseFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterCategory} onValueChange={(v) => onFilterChange(v as ExpenseCategory | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange(sortOrder === "newest" ? "oldest" : "newest")}
        className="gap-2"
      >
        <ArrowDownUp className="h-3.5 w-3.5" />
        {sortOrder === "newest" ? "Newest First" : "Oldest First"}
      </Button>
    </div>
  );
}
