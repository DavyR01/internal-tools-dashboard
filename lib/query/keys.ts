export const queryKeys = {
   tools: {
      all: ["tools"] as const,
      list: (params?: Record<string, any>) =>
         ["tools", "list", params] as const,
      detail: (id: number) =>
         ["tools", "detail", id] as const,
   },

   analytics: {
      all: ["analytics"] as const,
      overview: ["analytics", "overview"] as const,
   },
};
