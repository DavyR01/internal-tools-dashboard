import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToolViewModal from "../ToolViewModal";

const tool = {
   id: 1,
   name: "Slack",
   vendor: "Salesforce",
   category: "Communication",
   status: "active",
   monthly_cost: 1200,
   active_users_count: 42,
   website_url: "https://slack.com",
   description: "Team chat",
} as any;

describe("ToolViewModal", () => {
   test("renders tool details and closes on button click", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(<ToolViewModal open tool={tool} onClose={onClose} />);

      // modal exists
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // key information displayed (assert a few stable values)
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText(/salesforce/i)).toBeInTheDocument();
      expect(screen.getByText(/communication/i)).toBeInTheDocument();
      expect(screen.getByText(/active/i)).toBeInTheDocument();
      expect(screen.getByText(/1200/i)).toBeInTheDocument();
      expect(screen.getByText(/42/i)).toBeInTheDocument();

      // website link present if shown as link
      const link = screen.queryByRole("link", { name: /slack/i }) ?? screen.getByRole("link");
      expect(link).toHaveAttribute("href", expect.stringContaining("slack.com"));

      const dialog = screen.getByRole("dialog");

      const closeButtons =
         within(dialog).queryAllByRole("button", { name: /close/i });
      // close
      const closeBtn =
         closeButtons[0] ??
         within(dialog).getByRole("button", { name: /done|ok/i });

      await user.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
   });
});
