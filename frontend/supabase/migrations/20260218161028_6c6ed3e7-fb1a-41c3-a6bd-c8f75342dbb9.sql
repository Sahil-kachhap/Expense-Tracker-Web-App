
-- Create expenses table (amount stored in cents as integer)
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  idempotency_key TEXT UNIQUE
);

-- Indexes for efficient filtering/sorting
CREATE INDEX idx_expenses_date ON public.expenses (date DESC);
CREATE INDEX idx_expenses_category ON public.expenses (category);
CREATE INDEX idx_expenses_date_category ON public.expenses (date DESC, category);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for this app)
CREATE POLICY "Anyone can read expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete expenses" ON public.expenses FOR DELETE USING (true);
