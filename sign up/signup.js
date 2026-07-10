// ========================================
// Register Form
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // Get register form
  const registerForm = document.getElementById("registerForm");

  // Stop if form doesn't exist
  if (!registerForm) {
    console.error("Register form not found.");
    return;
  }

  // Register user when form is submitted
  registerForm.addEventListener("submit", registerUser);
});

// ========================================
// Register User
// ========================================
async function registerUser(e) {
  e.preventDefault();

  const form = e.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Get submit button (used for loading state)
  const submitButton = e.currentTarget.querySelector('button[type="submit"]');

  // -----------------------------
  // Read form values
  // -----------------------------
  const fullName = document.getElementById("addFName").value.trim();

  const userName = document.getElementById("addUName").value.trim();

  const gender = document.getElementById("addGender").value;

  const phone = document.getElementById("addPhone").value.trim();

  const email = document.getElementById("addEmail").value.trim();

  const password = document.getElementById("addPWd").value;

  const confirmPassword = document.getElementById("addCPWd").value;

  // -----------------------------
  // Validation
  // -----------------------------
  const errors = [];

  if (!fullName) errors.push("Full Name");
  if (!userName) errors.push("Username");
  if (!gender) errors.push("Gender");
  if (!phone) errors.push("Phone");
  if (!email) errors.push("Email");
  if (!password) errors.push("Password");
  if (!confirmPassword) errors.push("Confirm Password");

  if (errors.length) {
    showCustomPopup("Please fill these fields:\n\n" + errors.join("\n"));
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    showCustomPopup("Phone number must be 10 digits.");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showCustomPopup("Invalid email address.");
    return;
  }
  if (password.length < 6) {
    showCustomPopup("Password must contain at least 6 characters.");
    return;
  }
  if (password !== confirmPassword) {
    showCustomPopup("Passwords do not match.");
    return;
  }

  // -----------------------------
  // Create signup object
  // -----------------------------
  const user = {
    fullName,
    name: fullName,
    userName,
    username: userName,
    gender,
    phone,
    email,
    password,
  };

  // Show loading
  window.setButtonLoading?.(submitButton, true, "Creating account...");

  window.showAppLoader?.("Creating account...");

  try {
    // Send signup request
    const result = await signUp(user);

    if (result.success) {
      // ----------------------------------
      // Save signup information locally
      // (Used after login because API
      // profile doesn't return email/phone)
      // ----------------------------------
      localStorage.setItem("registeredUserData", JSON.stringify(user));

      // Store display name
      localStorage.setItem("loggedInUserName", fullName || userName || "User");

      // Success popup
      showCustomPopup(
        "Registration successful! You will be redirected to the login page.",
        "Success",
        {
          onConfirm() {
            window.location.href = "../login/login_page.html";
          },
        },
      );
    } else {
      // Signup failed
      showCustomPopup(
        result.data?.error || result.error || "Please try again.",
        "Registration failed",
      );
    }
  } finally {
    // Hide loading
    window.hideAppLoader?.();

    window.setButtonLoading?.(submitButton, false);
  }
}
