import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { api } from "@/lib/api/axios";

export function useAnalyticsOverview() {
   return useQuery({
      queryKey: queryKeys.analytics.overview,
      queryFn: async () => {
         const { data } = await api.get("/analytics");
         return data;
      },
   });
}

export function useTopToolsByCost(limit = 5) {
   return useQuery({
      queryKey: queryKeys.analytics.topTools(limit),
      queryFn: async () => {
         const { data } = await api.get(
            `/tools?_sort=monthly_cost&_order=desc&_limit=${limit}`
         );
         return data;
      },
   });
}

export function useToolsForDepartmentCostBreakdown() {
   return useQuery({
      queryKey: queryKeys.analytics.departmentCosts(),
      queryFn: async () => {
         const { data } = await api.get("/tools?_limit=1000");
         return data;
      },
   });
}
