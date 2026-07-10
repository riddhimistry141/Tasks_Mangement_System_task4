// ======================================================
// Display Name Helper
// ======================================================

// Extract a display name from different response formats
function extractDisplayName(value) {
  // Handle string values
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  // Handle arrays
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractDisplayName(item);

      if (found) return found;
    }

    return "";
  }

  // Ignore invalid values
  if (!value || typeof value !== "object") {
    return "";
  }

  // Try common user name properties
  const keys = [
    "fullName",
    "name",
    "userName",
    "username",
    "displayName",
    "firstName",
    "lastName",
  ];

  for (const key of keys) {
    const found = extractDisplayName(value[key]);

    if (found) return found;
  }

  // Use email prefix if available
  if (value.email) {
    const emailName = String(value.email).split("@")[0];

    if (emailName) return emailName;
  }

  // Search nested objects
  for (const nestedValue of Object.values(value)) {
    const found = extractDisplayName(nestedValue);

    if (found) return found;
  }

  return "";
}

// ======================================================
// Login Page Initialization
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  // Get login form
  const loginForm = document.getElementById("loginForm");

  // Stop if form is unavailable
  if (!loginForm) {
    console.error("Login form not found.");

    return;
  }

  // ======================================================
  // Login Form Submission
  // ======================================================

  loginForm.addEventListener("submit", async (e) => {
    // Prevent page refresh
    e.preventDefault();

    // Get submit button
    const submitButton = loginForm.querySelector('button[type="submit"]');

    // Collect login credentials
    const email = document.getElementById("addEmail").value;

    const password = document.getElementById("addPWd").value;

    // ======================================================
    // Form Validation
    // ======================================================

    if (email.trim() === "" || password.trim() === "") {
      showCustomPopup("Please fill in all fields.");

      return;
    }

    // Create login request payload
    const userData = {
      email,
      password,
    };

    // Show loading state
    window.setButtonLoading?.(submitButton, true, "Signing in...");

    window.showAppLoader?.("Signing in...");

    try {
      // ======================================================
      // Authenticate User
      // ======================================================

      const result = await loginUser(userData);

      console.log("LOGIN RESPONSE");
      console.log(result.data);

      // ======================================================
      // Login Successful
      // ======================================================

      if (result.success) {
        // Save authentication token
        const token = result.data.accessToken || result.data.token;

        localStorage.setItem("accessToken", token);

        // ======================================================
        // Load User Profile
        // ======================================================

        let profile = await getProfile();

        if (profile.success) {
          // Get previously stored registration data
          const oldData =
            JSON.parse(localStorage.getItem("registeredUserData")) || {};

          // Merge API profile with stored data
          const userData = {
            ...oldData,

            ...profile.data,

            email,

            // Keep phone entered during registration
            phone: oldData.phone || "",

            personalMobileNumber:
              profile.data.personalMobileNumber || oldData.phone || "",

            // Keep username
            userName: oldData.userName || email.split("@")[0],
          };

          // Save logged-in user
          localStorage.setItem("loggedInUserData", JSON.stringify(userData));

          localStorage.setItem("loggedInUserName", userData.fullName);
        }

        // ======================================================
        // Redirect to Dashboard
        // ======================================================

        showCustomPopup(
          "Login successful! You will be redirected to the dashboard.",

          "Success",

          {
            onConfirm() {
              window.location.href = "../dashboard/dashboard.html";
            },
          },
        );
      }

      // ======================================================
      // Login Failed
      // ======================================================
      else {
        showCustomPopup(
          result.data?.error ||
            result.error ||
            "Invalid email or password. Please try again.",

          "Login failed",
        );
      }
    } finally {
      // ======================================================
      // Reset Loading State
      // ======================================================

      window.hideAppLoader?.();

      window.setButtonLoading?.(
        submitButton,

        false,
      );
    }
  });
});
