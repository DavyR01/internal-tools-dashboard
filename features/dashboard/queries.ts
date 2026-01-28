import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { queryKeys } from "@/lib/query/keys";

export function useDashboardAnalytics() {
   return useQuery({
      queryKey: queryKeys.analytics.overview,
      queryFn: async () => {
         const { data } = await api.get("/analytics");
         return data;
      },
   });
}

export function useRecentTools() {
   return useQuery({
      queryKey: queryKeys.tools.list({ recent: true }),
      queryFn: async () => {
         const { data } = await api.get(
            "/tools?_sort=updated_at&_order=desc&_limit=8"
         );
         return data;
      },
   });
}

export function useDepartments() {
   return useQuery({
      queryKey: queryKeys.dashboard.departments(),
      queryFn: async () => {
         const { data } = await api.get("/departments");
         return data;
      },
   });
}
