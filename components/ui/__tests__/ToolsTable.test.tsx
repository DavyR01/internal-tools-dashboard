import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";

// Mock axios instance
jest.mock("@/lib/api/axios", () => ({
   api: {
      patch: jest.fn(),
   },
}));

import { api } from "@/lib/api/axios";
import ToolsTable from "@/features/tools/components/ToolsTable";

type ToolStatus = "active" | "unused" | "expiring";

const baseTool = {
   id: 1,
   name: "Slack",
   description: "Team chat",
   vendor: "Salesforce",
   category: "Communication",
   monthly_cost: 1200,
   previous_month_cost: 1100,
   owner_department: "IT",
   status: "active" as ToolStatus,
   website_url: "https://slack.com",
   active_users_count: 42,
   icon_url: "https://example.com/icon.png",
   created_at: "2025-01-01T00:00:00Z",
   updated_at: "2025-01-10T00:00:00Z",
};

describe("ToolsTable", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("shows loading rows when isLoading", () => {
      renderWithProviders(
         <ToolsTable
            tools={[]}
            isLoading={true}
            isError={false}
            onRetry={jest.fn()}
            onView={jest.fn()}
            onEdit={jest.fn()}
         />
      );

      // Table headers exist
      expect(screen.getByText("Tool")).toBeInTheDocument();
      // No empty message during loading
      expect(screen.queryByText(/no tools found/i)).not.toBeInTheDocument();
   });

   test("shows empty state row when tools empty and not loading", () => {
      renderWithProviders(
         <ToolsTable
            tools={[]}
            isLoading={false}
            isError={false}
            onRetry={jest.fn()}
            onView={jest.fn()}
            onEdit={jest.fn()}
         />
      );

      expect(screen.getByText(/no tools found/i)).toBeInTheDocument();
   });

   test("shows error panel and triggers retry", async () => {
      const user = userEvent.setup();
      const onRetry = jest.fn();

      renderWithProviders(
         <ToolsTable
            tools={[]}
            isLoading={false}
            isError={true}
            onRetry={onRetry}
            onView={jest.fn()}
            onEdit={jest.fn()}
         />
      );

      expect(screen.getByText(/couldn’t load tools/i)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /retry/i }));
      expect(onRetry).toHaveBeenCalledTimes(1);
   });

   test("clicking Disable triggers PATCH with nextStatus=unused", async () => {
      const user = userEvent.setup();

      (api.patch as jest.Mock).mockResolvedValueOnce({
         data: { ...baseTool, status: "unused" },
      });

      renderWithProviders(
         <ToolsTable
            tools={[baseTool]}
            isLoading={false}
            isError={false}
            onRetry={jest.fn()}
            onView={jest.fn()}
            onEdit={jest.fn()}
         />
      );

      expect(screen.getByText("Slack")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /disable/i }));

      await waitFor(() => {
         expect(api.patch).toHaveBeenCalledWith("/tools/1", { status: "unused" });
      });
   });

   test("clicking Enable triggers PATCH with nextStatus=active", async () => {
      const user = userEvent.setup();

      const unusedTool = { ...baseTool, id: 2, name: "Notion", status: "unused" as ToolStatus };

      (api.patch as jest.Mock).mockResolvedValueOnce({
         data: { ...unusedTool, status: "active" },
      });

      renderWithProviders(
         <ToolsTable
            tools={[unusedTool]}
            isLoading={false}
            isError={false}
            onRetry={jest.fn()}
            onView={jest.fn()}
            onEdit={jest.fn()}
         />
      );

      await user.click(screen.getByRole("button", { name: /enable/i }));

      await waitFor(() => {
         expect(api.patch).toHaveBeenCalledWith("/tools/2", { status: "active" });
      });
   });
});
