import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function formatCurrency(amountInCents: number): string {
  return `₹${(amountInCents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

const categoryLabels: Record<string, string> = {
  food: "Food & Dining",
  transport: "Transport",
  entertainment: "Entertainment",
  shopping: "Shopping",
  bills: "Bills & Utilities",
  health: "Health",
  education: "Education",
  other: "Other",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return errorResponse("Method not allowed", 405);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "csv";
  const category = url.searchParams.get("category");
  const sort = url.searchParams.get("sort") || "newest";
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  try {
    let query = supabase.from("expenses").select("*");
    if (category && category !== "all") query = query.eq("category", category);
    if (startDate) query = query.gte("date", startDate);
    if (endDate) query = query.lte("date", endDate);
    query = query.order("date", { ascending: sort === "oldest" });
    query = query.limit(1000);

    const { data, error } = await query;
    if (error) return errorResponse(error.message, 500);

    const rows = (data || []).map((e: { date: string; category: string; description: string; amount: number }) => ({
      Date: formatDate(e.date),
      Category: categoryLabels[e.category] || e.category,
      Description: e.description,
      Amount: formatCurrency(e.amount),
    }));

    if (format === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(rows);
      // Set column widths
      ws["!cols"] = [
        { wch: 16 }, // Date
        { wch: 20 }, // Category
        { wch: 40 }, // Description
        { wch: 14 }, // Amount
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Expenses");
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      return new Response(buf, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="expenses.xlsx"',
        },
      });
    }

    // CSV
    const header = "Date,Category,Description,Amount\n";
    const csvRows = rows.map((r: { Date: string; Category: string; Description: string; Amount: string }) =>
      [r.Date, r.Category, `"${r.Description.replace(/"/g, '""')}"`, r.Amount].join(",")
    );
    const csv = "\uFEFF" + header + csvRows.join("\n");

    return new Response(csv, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="expenses.csv"',
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return errorResponse("Internal server error", 500);
  }
});
