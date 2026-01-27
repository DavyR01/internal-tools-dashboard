import PageShell from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, TD, TH, THead, TR } from "@/components/ui/Table";

export default function DashboardPage() {
   return (
      <PageShell>
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Internal Tools Dashboard</h1>
            <Button variant="primary">Add Tool</Button>
         </div>
         <p className="mt-2 text-sm text-gray-500">
            Monitor and manage your organization•s software tools and expenses
         </p>

         <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
               <CardHeader>
                  <div className="text-sm text-muted">Monthly Budget</div>
                  <div className="mt-1 text-2xl font-semibold">€28,750 / €30,000</div>
               </CardHeader>
               <CardContent>
                  <StatusBadge status="expiring">+12%</StatusBadge>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <div className="text-sm text-muted">Active Tools</div>
                  <div className="mt-1 text-2xl font-semibold">147</div>
               </CardHeader>
               <CardContent>
                  <StatusBadge status="active">+8</StatusBadge>
               </CardContent>
            </Card>
         </div>

         <div className="mt-6">
            <Table>
               <THead>
                  <tr>
                     <TH>Tool</TH>
                     <TH>Status</TH>
                     <TH className="text-right">Monthly</TH>
                  </tr>
               </THead>
               <tbody>
                  <TR>
                     <TD>Slack</TD>
                     <TD><StatusBadge status="active">Active</StatusBadge></TD>
                     <TD className="text-right">€1,200</TD>
                  </TR>
                  <TR>
                     <TD>Figma</TD>
                     <TD><StatusBadge status="expiring">Expiring</StatusBadge></TD>
                     <TD className="text-right">€980</TD>
                  </TR>
               </tbody>
            </Table>
         </div>
      </PageShell>
   );
}
