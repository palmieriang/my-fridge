import { UserActions } from "./UserActions";
import { render, screen } from "../../test/test-utils";

describe("UserActions", () => {
  it("should render logout and delete account actions", () => {
    render(<UserActions />);

    expect(screen.getByText("logout")).toBeTruthy();
    expect(screen.getByText("deleteAccount")).toBeTruthy();
  });
});
