import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

const VALID_CATEGORIES = [
  "food", "transport", "entertainment", "shopping",
  "bills", "health", "education", "other",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);

  try {
    // DELETE /expenses?id=xxx
    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return errorResponse("Missing id parameter", 400);

      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) return errorResponse(error.message, 500);
      return jsonResponse({ success: true });
    }

    // GET /expenses — list with filters
    if (req.method === "GET") {
      const category = url.searchParams.get("category");
      const sort = url.searchParams.get("sort") || "newest";
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");

      let query = supabase.from("expenses").select("*");

      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      if (startDate) query = query.gte("date", startDate);
      if (endDate) query = query.lte("date", endDate);

      query = query.order("date", { ascending: sort === "oldest" });
      query = query.limit(1000);

      const { data, error } = await query;
      if (error) return errorResponse(error.message, 500);

      const total = (data || []).reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

      return jsonResponse({ expenses: data || [], total });
    }

    // POST /expenses — create
    if (req.method === "POST") {
      const body = await req.json();
      const { amount, category, description, date, idempotencyKey } = body;

      // Validation
      if (typeof amount !== "number" || amount <= 0) {
        return errorResponse("Amount must be a positive number", 400);
      }
      if (!VALID_CATEGORIES.includes(category)) {
        return errorResponse("Invalid category", 400);
      }
      if (!description || typeof description !== "string" || description.trim().length === 0) {
        return errorResponse("Description is required", 400);
      }
      if (description.length > 200) {
        return errorResponse("Description must be 200 characters or fewer", 400);
      }
      if (!date) {
        return errorResponse("Date is required", 400);
      }

      // Idempotency check
      if (idempotencyKey) {
        const { data: existing } = await supabase
          .from("expenses")
          .select("*")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();

        if (existing) {
          return jsonResponse({ expense: existing }, 200);
        }
      }

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          amount: Math.round(amount),
          category,
          description: description.trim(),
          date,
          idempotency_key: idempotencyKey || null,
        })
        .select()
        .single();

      if (error) return errorResponse(error.message, 500);
      return jsonResponse({ expense: data }, 201);
    }

    return errorResponse("Method not allowed", 405);
  } catch (err) {
    console.error("Unhandled error:", err);
    return errorResponse("Internal server error", 500);
  }
});
