"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadTextFile, toCsv } from "@/lib/utils/csv";
import {
   useAnalyticsOverview,
   useToolsForDepartmentCostBreakdown,
   useTopToolsByCost,
} from "../queries";

function formatMonthLabel(type: "previous" | "current") {
   // Simple: aligné avec UI actuelle ("Previous month" / "Current month")
   return type === "previous" ? "Previous month" : "Current month";
}

export default function ExportReportButton() {
   const { data: overview } = useAnalyticsOverview();
   const { data: toolsForDepartments } = useToolsForDepartmentCostBreakdown();
   const { data: toolsForTop } = useTopToolsByCost();

   const isDisabled = !overview || !toolsForDepartments || !toolsForTop;

   function handleExport() {
      if (!overview || !toolsForDepartments || !toolsForTop) return;

      // 1) Overview section
      const rows: Array<Array<unknown>> = [
         ["Internal Tools Analytics Report"],
         ["Generated at", new Date().toISOString()],
         [],
         ["Overview"],
         ["Period", "Total spend (EUR)"],
         [formatMonthLabel("previous"), overview.budget_overview.previous_month_total],
         [formatMonthLabel("current"), overview.budget_overview.current_month_total],
         [],
      ];

      // 2) Cost by department (sum monthly_cost)
      const byDept = new Map<string, number>();
      for (const t of toolsForDepartments) {
         const dept = t.owner_department ?? "Unknown";
         const cost = Number(t.monthly_cost ?? 0);
         byDept.set(dept, (byDept.get(dept) ?? 0) + cost);
      }

      rows.push(["Cost by department"]);
      rows.push(["Department", "Monthly cost (EUR)"]);
      for (const [dept, total] of Array.from(byDept.entries()).sort((a, b) => b[1] - a[1])) {
         rows.push([dept, Math.round(total)]);
      }
      rows.push([]);

      // 3) Top expensive tools
      const topTools = [...toolsForTop]
         .sort((a, b) => Number(b.monthly_cost ?? 0) - Number(a.monthly_cost ?? 0))
         .slice(0, 10);

      rows.push(["Top expensive tools"]);
      rows.push(["Tool", "Vendor", "Department", "Status", "Monthly cost (EUR)", "Active users"]);
      for (const t of topTools) {
         rows.push([
            t.name,
            t.vendor,
            t.owner_department,
            t.status,
            Number(t.monthly_cost ?? 0),
            Number(t.active_users_count ?? 0),
         ]);
      }

      const csv = toCsv(rows);
      const filename = `analytics-report-${new Date().toISOString().slice(0, 10)}.csv`;
      downloadTextFile(filename, csv);
   }

   return (
      <Button
         variant="secondary"
         onClick={handleExport}
         disabled={isDisabled}
         aria-label="Export analytics report as CSV"
         title={isDisabled ? "Load analytics data to enable export" : "Export CSV"}
      >
         <Download className="h-4 w-4" />
         Export report
      </Button>
   );
}
