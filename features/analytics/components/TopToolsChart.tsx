"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function TopToolsChart() {
   return (
      <Card>
         <CardHeader>
            <h3 className="text-sm font-medium">Top expensive tools</h3>
            <p className="mt-1 text-xs text-muted">
               Highest monthly costs across the tools catalog.
            </p>
         </CardHeader>
         <CardContent>
            <div className="h-64" />
         </CardContent>
      </Card>
   );
}
