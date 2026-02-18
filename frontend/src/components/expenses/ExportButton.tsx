import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { ExpenseCategory, SortOrder } from "@/types/expense";

interface ExportButtonProps {
  filterCategory: ExpenseCategory | "all";
  sortOrder: SortOrder;
}

export function ExportButton({ filterCategory, sortOrder }: ExportButtonProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async (format: "csv" | "xlsx") => {
    setExporting(format);
    try {
      const params = new URLSearchParams({ format, sort: sortOrder });
      if (filterCategory !== "all") params.set("category", filterCategory);

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const url = `https://${projectId}.supabase.co/functions/v1/export-expenses?${params}`;

      const response = await fetch(url, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Export failed");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `expenses.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      toast({ title: "Export complete", description: `Your ${format.toUpperCase()} file has been downloaded.` });
    } catch (err: any) {
      toast({
        title: "Export failed",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={!!exporting}>
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
          <FileText className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
