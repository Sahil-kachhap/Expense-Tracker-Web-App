import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  Expense,
  ExpenseCategory,
  ExpenseFormData,
  SortOrder,
} from "@/types/expense";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "all">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const fetchExpenses = useCallback(
    async (category?: ExpenseCategory | "all", sort?: SortOrder) => {
      setIsLoading(true);
      try {
        console.log("URL", `${import.meta.env.VITE_API_URL}/api/expenses`);
        const cat = category ?? filterCategory;
        const s = sort ?? sortOrder;

        const params = new URLSearchParams();

        if (cat && cat !== "all") {
          params.append("category", cat);
        }

        params.append("sort", s === "oldest" ? "asc" : "desc");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const result = await response.json();

        setExpenses(result.expenses || []);
        setTotal(result.total || 0);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filterCategory, sortOrder]
  );

  useEffect(() => {
    console.log("Calling fetchExpenses...");
    fetchExpenses();
  }, []);

  const handleFilterChange = useCallback(
    (value: ExpenseCategory | "all") => {
      setFilterCategory(value);
      fetchExpenses(value, sortOrder);
    },
    [fetchExpenses, sortOrder]
  );

  const handleSortChange = useCallback(
    (value: SortOrder) => {
      setSortOrder(value);
      fetchExpenses(filterCategory, value);
    },
    [fetchExpenses, filterCategory]
  );

  const addExpense = useCallback(
    async (data: ExpenseFormData) => {
      setIsAdding(true);
      setAddError(null);
  
      const idempotencyKey = crypto.randomUUID();
  
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/expenses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": idempotencyKey,
            },
            body: JSON.stringify({
              amount: data.amount, // backend converts to cents
              category: data.category,
              description: data.description,
              date: data.date.toISOString().split("T")[0],
            }),
          }
        );
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || "Failed to add expense");
        }
  
        await fetchExpenses();
      } catch (err: any) {
        const msg =
          err?.message || "Failed to add expense. Please try again.";
        setAddError(msg);
        throw err;
      } finally {
        setIsAdding(false);
      }
    },
    [fetchExpenses]
  );
  

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
  
      setExpenses((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        setTotal(updated.reduce((sum, e) => sum + e.amount, 0));
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  }, []);
  

  return {
    expenses,
    total,
    isLoading,
    isAdding,
    addError,
    addExpense,
    deleteExpense,
    filterCategory,
    setFilterCategory: handleFilterChange,
    sortOrder,
    setSortOrder: handleSortChange,
    hasExpenses: expenses.length > 0,
    isFiltered: filterCategory !== "all",
    refetch: fetchExpenses,
  };
}
