import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToolEditModal from "../ToolEditModal";
import { makeTool } from "../../test-utils/fixtures";

const tool = makeTool();

describe("ToolEditModal", () => {
   test("prefills fields from tool and calls onSave with a valid patch", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      const onSave = jest.fn();

      render(
         <ToolEditModal
            open
            tool={tool}
            onClose={onClose}
            onSave={onSave}
            isSaving={false}
            isError={false}
         />
      );

      // Modal visible
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Edit tool")).toBeInTheDocument();

      // Prefill
      const nameInput = screen.getByRole("textbox");
      const costInput = screen.getByLabelText(/monthly cost/i);
      const usersInput = screen.getByLabelText(/users/i);
      const statusSelect = screen.getByRole("combobox");

      expect(nameInput).toHaveValue("Slack");
      expect(costInput).toHaveValue(1200);
      // Fixture-dependent: if your makeTool() sets users to a number, assert it.
      // Slack fixture usually has users = 205 in your UI screenshot context.
      expect(usersInput).toHaveValue(tool.active_users_count ?? 0);
      expect(statusSelect).toHaveValue("active");

      // Update values
      await user.clear(nameInput);
      await user.type(nameInput, "  Notion  "); // to check trim

      await user.clear(costInput);
      await user.type(costInput, "999");

      await user.clear(usersInput);
      await user.type(usersInput, "42");

      await user.selectOptions(statusSelect, "unused");

      await user.click(screen.getByRole("button", { name: /^save$/i }));

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith({
         name: "Notion",
         monthly_cost: 999,
         active_users_count: 42,
         status: "unused",
      });
   });

   test("clicking Cancel calls onClose", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
         <ToolEditModal
            open
            tool={tool}
            onClose={onClose}
            onSave={jest.fn()}
            isSaving={false}
            isError={false}
         />
      );

      await user.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
   });

   test("when isSaving disables actions and when isError shows error panel", () => {
      render(
         <ToolEditModal
            open
            tool={tool}
            onClose={jest.fn()}
            onSave={jest.fn()}
            isSaving={true}
            isError={true}
         />
      );

      // Error message
      expect(screen.getByText(/couldn’t save changes/i)).toBeInTheDocument();
      expect(screen.getByText(/please retry/i)).toBeInTheDocument();

      // Buttons disabled + label changes
      expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
   });
});
