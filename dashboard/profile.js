// ======================================================
// Local Storage Helpers
// ======================================================

// Get saved user data from Local Storage
function getSavedUser() {
  const raw = localStorage.getItem("loggedInUserData");

  if (!raw) return {};

  try {
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

// Save user data to Local Storage
function saveUserData(obj) {
  localStorage.setItem("loggedInUserData", JSON.stringify(obj));
}

// ======================================================
// Profile Page Initialization
// ======================================================

document.addEventListener("DOMContentLoaded", async function () {
  // ======================================================
  // Get Form Elements
  // ======================================================

  const emailEl = document.getElementById("profileEmail");
  const phoneEl = document.getElementById("profilePhone");
  const phoneTypeEl = document.getElementById("phoneType");

  /*
    Previous Local Storage Only Implementation
    (Kept for future reference)
    */

  // ======================================================
  // Load Latest Profile From API
  // ======================================================

  window.showAppLoader?.("Loading profile...");

  const result = await getProfile();

  window.hideAppLoader?.();

  let saved = {};

  if (result.success) {
    // Merge API response with existing Local Storage data
    const oldData = getSavedUser();

    saved = {
      ...oldData,
      ...result.data,
    };

    localStorage.setItem("loggedInUserData", JSON.stringify(saved));
  } else {
    // Fallback to Local Storage
    saved = getSavedUser();
  }

  // ======================================================
  // Get Registered User Information
  // ======================================================

  const registeredFull = localStorage.getItem("registeredFullName") || "";

  const registeredUser = localStorage.getItem("registeredUserName") || "";

  // ======================================================
  // Split Full Name Into First & Last Name
  // ======================================================

  const full = saved.fullName || saved.name || registeredFull || "";

  const parts = full.trim().split(/\s+/);

  const first = parts.slice(0, -1).join(" ") || parts[0] || "";

  const last = parts.length > 1 ? parts[parts.length - 1] : "";

  // ======================================================
  // Populate Profile Form
  // ======================================================

  document.getElementById("profileFirstName").value = first;
  document.getElementById("profileLastName").value = last;

  emailEl.value = saved.email || "";

  phoneEl.value =
    saved.personalMobileNumber ||
    saved.phone ||
    localStorage.getItem("registeredPhone") ||
    "";

  if (phoneTypeEl) {
    phoneTypeEl.value = saved.phoneType || "mobile";
  }

  // ======================================================
  // Set Selected Gender
  // ======================================================

  if (saved.gender) {
    const radio = document.querySelector(
      `input[name="genderOptions"][value="${saved.gender}"]`,
    );

    if (radio) {
      radio.checked = true;
    }
  }

  // ======================================================
  // Avatar Elements
  // ======================================================

  const avatarInput = document.getElementById("avatarInput");

  const avatarPreview = document.getElementById("avatarPreview");

  // ======================================================
  // Update Avatar Preview
  // ======================================================

  function setAvatarBase64(base64) {
    if (base64) {
      localStorage.setItem("loggedInUserAvatar", base64);

      avatarPreview.src = base64;
      avatarPreview.style.display = "block";
    } else {
      localStorage.removeItem("loggedInUserAvatar");

      avatarPreview.src = "";
      avatarPreview.style.display = "none";
    }
  }

  // ======================================================
  // Load Existing Avatar
  // ======================================================

  const existingAvatar = localStorage.getItem("loggedInUserAvatar");

  if (existingAvatar) {
    avatarPreview.src = existingAvatar;
    avatarPreview.style.display = "block";
  }

  // ======================================================
  // Avatar Upload
  // ======================================================

  avatarInput.addEventListener("change", function (evt) {
    const file = evt.target.files && evt.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const base64 = e.target.result;

      setAvatarBase64(base64);
    };

    reader.readAsDataURL(file);
  });

  // ======================================================
  // Remove Avatar
  // ======================================================

  document
    .getElementById("removeAvatar")
    .addEventListener("click", function () {
      showCustomPopup("Remove avatar?", "Confirm", {
        type: "confirm",

        onConfirm: function () {
          setAvatarBase64(null);

          avatarInput.value = "";
        },
      });
    });

  /*
    Previous Save Profile Implementation
    (Kept for future reference)
    */
  // ======================================================
  // Save Profile
  // ======================================================

  document
    .getElementById("profileForm")
    .addEventListener("submit", async function (e) {
      // Prevent default form submission
      e.preventDefault();

      // ==========================================
      // Collect Form Data
      // ==========================================

      const first = document.getElementById("profileFirstName").value.trim();

      const last = document.getElementById("profileLastName").value.trim();

      // Combine first and last name
      const fullName = (first + " " + last).trim();

      // Get selected gender
      const gender =
        document.querySelector('input[name="genderOptions"]:checked')?.value ||
        "";

      // Get phone number
      const phone = document.getElementById("profilePhone").value;

      // Get selected profile image
      const file = document.getElementById("avatarInput").files[0];

      // ==========================================
      // Update Profile Using API
      // ==========================================

      const result = await updateProfile({
        fullName,

        gender,

        personalMobileNumber: phone,

        profileImage: file,
      });

      // ==========================================
      // Handle Successful Update
      // ==========================================

      if (result.success) {
        // Keep previously stored email & username
        const oldData =
          JSON.parse(localStorage.getItem("loggedInUserData")) || {};

        // Merge latest profile data
        const updated = {
          ...oldData,

          ...result.data,

          email: oldData.email,
        };

        // Save updated profile
        localStorage.setItem("loggedInUserData", JSON.stringify(updated));

        // Save display name
        localStorage.setItem("loggedInUserName", updated.fullName);

        // Show success message
        showCustomPopup("Profile Updated", "Success");
      }
    });

  // ======================================================
  // Clear Stored Profile Data
  // ======================================================

  const clearBtn = document.getElementById("clearBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      showCustomPopup("Clear stored profile data?", "Confirm", {
        type: "confirm",

        onConfirm: function () {
          // Remove Local Storage data
          localStorage.removeItem("loggedInUserData");
          localStorage.removeItem("loggedInUserName");
          localStorage.removeItem("registeredFullName");
          localStorage.removeItem("registeredUserName");

          // Reset form fields
          document.getElementById("profileFirstName").value = "";

          document.getElementById("profileLastName").value = "";

          emailEl.value = "";
          phoneEl.value = "";

          if (phoneTypeEl) {
            phoneTypeEl.value = "mobile";
          }

          // Clear selected gender
          document
            .querySelectorAll('input[name="genderOptions"]')
            .forEach((radio) => {
              radio.checked = false;
            });

          // Show confirmation
          showCustomPopup("Cleared.", "Success");
        },
      });
    });
  }
});
