"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function CostEvolutionChart() {
   return (
      <Card>
         <CardHeader>
            <h3 className="text-sm font-medium">Monthly spend evolution</h3>
            <p className="mt-1 text-xs text-muted">
               Total monthly spend trend (current vs previous period).
            </p>
         </CardHeader>
         <CardContent>
            <div className="h-64" />
         </CardContent>
      </Card>
   );
}
