export const queryKeys = {
   tools: {
      all: ["tools"] as const,
      list: (params?: Record<string, unknown>) =>
         ["tools", "list", params] as const,
      detail: (id: number) =>
         ["tools", "detail", id] as const,
   },

   analytics: {
      all: ["analytics"] as const,
      overview: ["analytics", "overview"] as const,
      topTools: () => ["analytics", "top-tools"],
      departmentCosts: () => ["analytics", "department-costs"],
   },

   dashboard: {
      all: ["dashboard"] as const,
      departments: () => ["dashboard", "departments"] as const,
   },
};
