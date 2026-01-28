import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnalyticsWidget } from "@/components/ui/AnalyticsWidget";

describe("AnalyticsWidget", () => {
   test("renders title and children by default", () => {
      render(
         <AnalyticsWidget title="Spend">
            <div>Chart content</div>
         </AnalyticsWidget>
      );

      expect(screen.getByText("Spend")).toBeInTheDocument();
      expect(screen.getByText("Chart content")).toBeInTheDocument();
   });

   test("shows loading skeleton when isLoading", () => {
      const { container } = render(
         <AnalyticsWidget title="Spend" isLoading>
            <div>Chart content</div>
         </AnalyticsWidget>
      );

      // children hidden
      expect(screen.queryByText("Chart content")).not.toBeInTheDocument();

      // skeleton exists (simple + stable: we assert presence of the loading block)
      // it's the only element with h-64 in widget state
      expect(container.querySelector(".h-64")).toBeTruthy();
   });

   test("shows error state and calls onRetry", async () => {
      const user = userEvent.setup();
      const onRetry = jest.fn();

      render(
         <AnalyticsWidget title="Spend" isError onRetry={onRetry}>
            <div>Chart content</div>
         </AnalyticsWidget>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/unable to load spend/i)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /retry/i }));
      expect(onRetry).toHaveBeenCalledTimes(1);
   });

   test("shows empty state when isEmpty", () => {
      render(
         <AnalyticsWidget title="Spend" isEmpty>
            <div>Chart content</div>
         </AnalyticsWidget>
      );

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
      expect(screen.queryByText("Chart content")).not.toBeInTheDocument();
   });
});
