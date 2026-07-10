// ======================================================
// User Registration
// ======================================================

// Register a new user account
async function signUp(userData) {
  try {
    // Send registration request
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    });

    // Parse API response
    const data = await response.json();

    // Log API errors for debugging
    if (!response.ok) {
      console.error("Auth API error", response.status, data);
    }

    // Return registration result
    return {
      success: response.ok,
      status: response.status,
      data,

      error: response.ok
        ? undefined
        : data?.message || data?.error || "Request failed",
    };
  } catch (error) {
    // Handle network errors
    return {
      success: false,
      error: error.message,
    };
  }
}

// ======================================================
// User Login
// ======================================================

// Authenticate existing user
async function loginUser(userData) {
  try {
    // Send login request
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    });

    // Parse API response
    const data = await response.json();

    // Return login result
    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    // Handle network errors
    return {
      success: false,
      error: error.message,
    };
  }
}

// ======================================================
// User Logout
// ======================================================

// Logout current user
async function logoutUser() {
  // Get authentication token
  const token = localStorage.getItem("accessToken");

  // Notify server if token exists
  if (token) {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn("Logout API request failed:", error);
    }
  }

  // Clear Local Storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("loggedInUserName");
  localStorage.removeItem("loggedInUserData");
  localStorage.removeItem("loggedInUserAvatar");
}

// ======================================================
// Get User Profile
// ======================================================

// Fetch logged-in user's profile
async function getProfile() {
  // Get authentication token
  const token = localStorage.getItem("accessToken");

  try {
    // Request profile data
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Parse API response
    const data = await response.json();

    // Return profile information
    return {
      success: response.ok,
      data,
    };
  } catch (error) {
    // Handle network errors
    return {
      success: false,
      error: error.message,
    };
  }
}
// ======================================================
// Update User Profile
// ======================================================

// Update logged-in user's profile information
async function updateProfile(profile) {
  // Get authentication token
  const token = localStorage.getItem("accessToken");

  // ======================================================
  // Create Form Data
  // ======================================================

  // FormData is required for uploading text fields and images
  const formData = new FormData();

  // Add full name
  if (profile.fullName) {
    formData.append("fullName", profile.fullName);
  }

  // Add gender
  if (profile.gender) {
    formData.append("gender", profile.gender);
  }

  // Add mobile number
  if (profile.personalMobileNumber) {
    formData.append("personalMobileNumber", profile.personalMobileNumber);
  }

  // Add address
  if (profile.address) {
    formData.append("address", profile.address);
  }

  // Add city
  if (profile.city) {
    formData.append("city", profile.city);
  }

  // Add university name
  if (profile.universityName) {
    formData.append("universityName", profile.universityName);
  }

  // Add guardian name
  if (profile.guardianName) {
    formData.append("guardianName", profile.guardianName);
  }

  // Add guardian phone number
  if (profile.guardianPhoneNumber) {
    formData.append("guardianPhoneNumber", profile.guardianPhoneNumber);
  }

  // Add profile image
  if (profile.profileImage) {
    formData.append("profileImage", profile.profileImage);
  }

  // ======================================================
  // Send Update Request
  // ======================================================

  try {
    // Send profile update request
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    });

    // Parse API response
    const data = await response.json();

    // Return update result
    return {
      success: response.ok,
      data,
    };
  } catch (err) {
    // Handle network errors
    return {
      success: false,
      error: err.message,
    };
  }
}
