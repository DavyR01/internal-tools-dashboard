'use client'

import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { useRecentTools } from "../queries";

export default function RecentToolsTable() {
   const { data, isLoading } = useRecentTools();

   if (isLoading) {
      return <div className="h-48 animate-pulse rounded-2xl bg-surface" />;
   }

   return (
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-x-auto">
         {/* Scroll container */}
         <div className="min-w-185">
            <Table className=" bg-surface">
               <THead>
                  <tr>
                     <TH>Tool</TH>
                     <TH>Department</TH>
                     <TH>Users</TH>
                     <TH className="text-left">Monthly Cost</TH>
                     <TH>Status</TH>
                  </tr>
               </THead>
               <tbody>
                  {data.map((tool: any) => (
                     <TR key={tool.id}>
                        <TD className="font-medium">{tool.name}</TD>
                        <TD>{tool.owner_department}</TD>
                        <TD>{tool.active_users_count}</TD>
                        <TD className="text-left">€{tool.monthly_cost}</TD>
                        <TD>
                           <StatusBadge status={tool.status} />
                        </TD>
                     </TR>
                  ))}
               </tbody>
            </Table>
         </div>
      </div>
   );
}
