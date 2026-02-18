const supabase = require("../config/supabase");

const createExpense = async (expenseData) => {
  const { data, error } = await supabase
    .from("expenses")
    .insert([expenseData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const getExpenses = async (filters) => {
  let query = supabase.from("expenses").select("*");

  // Filter by category
  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  // Date range filtering
  if (filters.startDate) {
    query = query.gte("date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("date", filters.endDate);
  }

  // Sorting
  const sortOrder = filters.sort === "asc";
  query = query.order("date", { ascending: sortOrder });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Calculate total in cents
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return {
    expenses: data,
    total,
  };
};

const deleteExpense = async (id) => {
  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};


const findByIdempotencyKey = async (key) => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('idempotency_key', key)
      .single();
  
    if (error && error.code !== 'PGRST116') {
      // Ignore "no rows found" error
      throw error;
    }
  
    return data || null;
  };

  const getExpensesForExport = async (filters) => {
    return await getExpenses(filters);
  };

  module.exports = {
    createExpense,
    getExpenses,
    deleteExpense,
    findByIdempotencyKey,
    getExpensesForExport
  };
  