import type { Tool } from "../queries";

export function makeTool(overrides: Partial<Tool> = {}): Tool {
   return {
      id: 1,
      name: "Slack",
      description: "Team chat",
      vendor: "Salesforce",
      category: "Communication",
      monthly_cost: 1200,
      previous_month_cost: 1100,
      owner_department: "Engineering",
      status: "active",
      website_url: "https://slack.com",
      active_users_count: 42,
      icon_url: "https://example.com/icon.png",
      created_at: "2025-01-01",
      updated_at: "2025-01-10",
      ...overrides,
   };
}
