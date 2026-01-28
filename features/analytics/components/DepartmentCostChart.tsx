"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function DepartmentCostChart() {
   return (
      <Card>
         <CardHeader>
            <h3 className="text-sm font-medium">Cost by department</h3>
            <p className="mt-1 text-xs text-muted">
               Share of total monthly spend by department.
            </p>
         </CardHeader>
         <CardContent>
            <div className="h-64" />
         </CardContent>
      </Card>
   );
}
