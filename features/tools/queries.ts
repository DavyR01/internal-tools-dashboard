import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { queryKeys } from "@/lib/query/keys";

export type ToolStatus = "active" | "unused" | "expiring";
export type SortOrder = "asc" | "desc";
export type ToolsSortBy = "name" | "monthly_cost" | "updated_at";

export type ToolsListParams = {
   page: number;
   limit: number;
   sortBy: ToolsSortBy;
   order: SortOrder;

   status?: ToolStatus;
   department?: string; // owner_department
   q?: string; // search (name_like)
};

export type Tool = {
   id: number;
   name: string;
   description: string;
   vendor: string;
   category: string;
   monthly_cost: number;
   previous_month_cost: number;
   owner_department: string;
   status: ToolStatus;
   website_url: string;
   active_users_count: number;
   icon_url: string;
   created_at: string;
   updated_at: string;
};

export type ToolsListResponse = {
   items: Tool[];
   total: number;
   page: number;
   limit: number;
};

function buildToolsListQuery(params: ToolsListParams) {
   const sp = new URLSearchParams();

   sp.set("_page", String(params.page));
   sp.set("_limit", String(params.limit));
   sp.set("_sort", params.sortBy);
   sp.set("_order", params.order);

   if (params.status) sp.set("status", params.status);
   if (params.department) sp.set("owner_department", params.department);

   const q = params.q?.trim();
   if (q) sp.set("name_like", q);

   return sp.toString();
}

async function fetchToolsList(params: ToolsListParams): Promise<ToolsListResponse> {
   const qs = buildToolsListQuery(params);
   const res = await api.get<Tool[]>(`/tools?${qs}`);

   const totalHeader = res.headers["x-total-count"];
   const total = totalHeader ? Number(totalHeader) : res.data.length;

   return {
      items: res.data,
      total: Number.isFinite(total) ? total : res.data.length,
      page: params.page,
      limit: params.limit,
   };
}

export function useToolsList(params: ToolsListParams) {
   return useQuery({
      queryKey: queryKeys.tools.list(params),
      queryFn: () => fetchToolsList(params),
      placeholderData: keepPreviousData,
   });
}

/** Optionnel (pour le filtre department) */
export type Department = {
   id: number;
   name: string;
   description: string;
   created_at: string;
   updated_at: string;
};

export function useDepartments() {
   return useQuery({
      queryKey: ["departments", "list"],
      queryFn: async () => {
         const { data } = await api.get<Department[]>("/departments");
         return data;
      },
   });
}



export function useToggleToolStatus() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (input: { id: number; nextStatus: ToolStatus }) => {
         const { id, nextStatus } = input;

         // JSON Server: PATCH partiel
         const { data } = await api.patch<Tool>(`/tools/${id}`, { status: nextStatus });
         return data;
      },
      onSuccess: () => {
         // Rafraîchir toutes les listes tools (toutes pages/filters)
         qc.invalidateQueries({ queryKey: ["tools"] });
      },
   });
}




export function useUpdateTool() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (input: { id: number; patch: Partial<Pick<Tool, "name" | "monthly_cost" | "status">> }) => {
         const { id, patch } = input;
         const { data } = await api.patch<Tool>(`/tools/${id}`, patch);
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ["tools"] });
      },
   });
}