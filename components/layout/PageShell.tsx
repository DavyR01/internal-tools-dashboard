import { Suspense } from "react";
import Header from "./Header";

export default function PageShell({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-bg text-text">
         <Suspense fallback={<div className="h-16 border-b border-border bg-surface" />}>
            <Header />
         </Suspense>
         <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      </div>
   );
}
