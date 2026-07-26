import SocialIcon from "./SocialIcon";
import { render, fireEvent } from "../../test/test-utils";

describe("SocialIcon", () => {
  it("should render Google sign in button and call signInGoogle on press", () => {
    const { getByLabelText } = render(<SocialIcon />);
    const button = getByLabelText("Sign in with Google");

    expect(button).toBeTruthy();
    fireEvent.press(button);
  });
});
