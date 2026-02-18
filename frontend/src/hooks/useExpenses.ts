import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Expense, ExpenseCategory, ExpenseFormData, SortOrder } from "@/types/expense";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const fetchExpenses = useCallback(async (category?: ExpenseCategory | "all", sort?: SortOrder) => {
    setIsLoading(true);
    try {
      const cat = category ?? filterCategory;
      const s = sort ?? sortOrder;

      let query = supabase.from("expenses").select("*");
      if (cat && cat !== "all") query = query.eq("category", cat);
      query = query.order("date", { ascending: s === "oldest" });
      query = query.limit(1000);

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data || []) as Expense[];
      setExpenses(rows);
      setTotal(rows.reduce((sum, e) => sum + e.amount, 0));
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, sortOrder]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleFilterChange = useCallback((value: ExpenseCategory | "all") => {
    setFilterCategory(value);
    fetchExpenses(value, sortOrder);
  }, [fetchExpenses, sortOrder]);

  const handleSortChange = useCallback((value: SortOrder) => {
    setSortOrder(value);
    fetchExpenses(filterCategory, value);
  }, [fetchExpenses, filterCategory]);

  const addExpense = useCallback(async (data: ExpenseFormData) => {
    setIsAdding(true);
    setAddError(null);
    const idempotencyKey = crypto.randomUUID();
    try {
      const { data: result, error } = await supabase.functions.invoke("expenses", {
        method: "POST",
        body: {
          amount: Math.round(data.amount * 100),
          category: data.category,
          description: data.description,
          date: data.date.toISOString().split("T")[0],
          idempotencyKey,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      await fetchExpenses();
    } catch (err: any) {
      const msg = err?.message || "Failed to add expense. Please try again.";
      setAddError(msg);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
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
