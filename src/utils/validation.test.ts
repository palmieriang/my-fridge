import {
  validateEmail,
  validatePassword,
  validateStrongPassword,
  validatePasswordConfirmation,
  validateFullName,
  validateRequired,
} from "./validation";

describe("validateEmail", () => {
  it("returns invalid when email is empty", () => {
    const result = validateEmail("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("returns invalid for a malformed email", () => {
    const result = validateEmail("notanemail");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("returns invalid when @ is missing", () => {
    const result = validateEmail("userdomain.com");
    expect(result.isValid).toBe(false);
  });

  it("returns valid for a well-formed email", () => {
    const result = validateEmail("user@example.com");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("validatePassword", () => {
  it("returns invalid when password is empty", () => {
    const result = validatePassword("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Password is required");
  });

  it("returns invalid when shorter than default min length of 6", () => {
    const result = validatePassword("abc");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Password must be at least 6 characters");
  });

  it("returns invalid when shorter than a custom min length", () => {
    const result = validatePassword("short", 10);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Password must be at least 10 characters");
  });

  it("returns valid when password meets minimum length", () => {
    const result = validatePassword("validpass");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("validateStrongPassword", () => {
  it("returns invalid when password is empty", () => {
    const result = validateStrongPassword("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Password is required");
  });

  it("returns invalid when shorter than 8 characters", () => {
    const result = validateStrongPassword("Ab1");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Password must be at least 8 characters");
  });

  it("returns invalid when missing uppercase letter", () => {
    const result = validateStrongPassword("alllower1");
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/uppercase/);
  });

  it("returns invalid when missing lowercase letter", () => {
    const result = validateStrongPassword("ALLUPPER1");
    expect(result.isValid).toBe(false);
  });

  it("returns invalid when missing a number", () => {
    const result = validateStrongPassword("NoNumbers!");
    expect(result.isValid).toBe(false);
  });

  it("returns valid for a strong password", () => {
    const result = validateStrongPassword("StrongPass1");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("validatePasswordConfirmation", () => {
  it("returns invalid when confirmPassword is empty", () => {
    const result = validatePasswordConfirmation("password123", "");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please confirm your password");
  });

  it("returns invalid when passwords do not match", () => {
    const result = validatePasswordConfirmation("password123", "different");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Passwords do not match");
  });

  it("returns valid when passwords match", () => {
    const result = validatePasswordConfirmation("password123", "password123");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("validateFullName", () => {
  it("returns invalid when name is empty", () => {
    const result = validateFullName("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Full name is required");
  });

  it("returns invalid when name is only whitespace", () => {
    const result = validateFullName("   ");
    expect(result.isValid).toBe(false);
  });

  it("returns invalid when name has fewer than 2 characters", () => {
    const result = validateFullName("A");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Full name must be at least 2 characters");
  });

  it("returns invalid when name exceeds 50 characters", () => {
    const result = validateFullName("A".repeat(51) + " Surname");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Full name must be less than 50 characters");
  });

  it("returns invalid when only one name part is provided", () => {
    const result = validateFullName("SingleName");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please enter your first and last name");
  });

  it("returns valid for a proper full name", () => {
    const result = validateFullName("John Doe");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("validateRequired", () => {
  it("returns invalid when value is empty", () => {
    const result = validateRequired("", "Email");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("returns invalid when value is only whitespace", () => {
    const result = validateRequired("   ", "Username");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Username is required");
  });

  it("returns valid when value has content", () => {
    const result = validateRequired("some value", "Field");
    expect(result.isValid).toBe(true);
  });
});
