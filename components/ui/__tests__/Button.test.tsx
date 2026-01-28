import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("renders button label", () => {
   render(<Button>Save</Button>);
   expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});
