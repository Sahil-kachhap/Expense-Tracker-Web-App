import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import type { ExpenseFormData } from "@/types/expense";

const formSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Amount must be positive")
    .max(10_000_000, "Amount is too large"),
  category: z.enum(
    ["food", "transport", "entertainment", "shopping", "bills", "health", "education", "other"],
    { required_error: "Select a category" }
  ),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Max 200 characters"),
  date: z.date({ required_error: "Pick a date" }),
});

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ExpenseForm({ onSubmit, isSubmitting }: ExpenseFormProps) {
  const [dateOpen, setDateOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      category: undefined,
      description: "",
      date: new Date(),
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values as ExpenseFormData);
      form.reset({ amount: undefined, category: undefined, description: "", date: new Date() });
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="rounded-xl border bg-card p-5 sm:p-6 expense-card-shadow animate-fade-in">
      <h2 className="mb-4 text-base font-semibold text-card-foreground">Add Expense</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="What was this expense for?" maxLength={200} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full sm:w-[200px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDateOpen(false);
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
