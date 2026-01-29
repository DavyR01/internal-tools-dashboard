import PageShell from "@/components/layout/PageShell";
import ToolsPageClient from "@/features/tools/components/ToolsPageClient";

type SearchParams = Record<string, string | string[] | undefined>;

type ToolsPageProps = {
   searchParams?: Promise<SearchParams> | SearchParams;
};

function getStringParam(value: string | string[] | undefined, fallback = ""): string {
   if (typeof value === "string") return value;
   return fallback;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
   const sp = searchParams
      ? await Promise.resolve(searchParams)
      : ({} as SearchParams);

   const q = getStringParam(sp.q, "");

   return (
      <PageShell>
         <ToolsPageClient initialQuery={q} />
      </PageShell>
   );
}
