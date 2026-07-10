// ======================================================
// Custom Popup Module
// ======================================================

(function () {
  // ======================================================
  // Create Popup Elements
  // ======================================================

  // Create popup and backdrop if they don't already exist
  function ensureCustomPopup() {
    if (document.getElementById("customPopupModal")) return;

    // Create popup backdrop
    const backdrop = document.createElement("div");

    backdrop.id = "customPopupBackdrop";
    backdrop.className = "custom-popup-backdrop";
    backdrop.hidden = true;

    // Create popup modal
    const modal = document.createElement("div");

    modal.id = "customPopupModal";
    modal.className = "custom-popup-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "customPopupTitle");
    modal.setAttribute("aria-describedby", "customPopupBody");
    modal.hidden = true;

    // Popup structure
    modal.innerHTML = `
            <div class="custom-popup-card">

                <div class="custom-popup-header">

                    <h5 id="customPopupTitle">
                        Notice
                    </h5>

                    <button
                        type="button"
                        class="custom-popup-close"
                        id="customPopupClose"
                        aria-label="Close">

                        &times;

                    </button>

                </div>

                <div
                    class="custom-popup-body"
                    id="customPopupBody">
                </div>

                <div
                    class="custom-popup-actions"
                    id="customPopupActions">
                </div>

            </div>
        `;

    // Add popup to page
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // Register close events
    document
      .getElementById("customPopupClose")
      .addEventListener("click", closeCustomPopup);

    backdrop.addEventListener("click", closeCustomPopup);
  }

  // ======================================================
  // Close Popup
  // ======================================================

  // Hide popup and backdrop
  function closeCustomPopup() {
    const backdrop = document.getElementById("customPopupBackdrop");

    const modal = document.getElementById("customPopupModal");

    if (backdrop) {
      backdrop.hidden = true;
    }

    if (modal) {
      modal.hidden = true;
    }
  }

  // ======================================================
  // Show Popup
  // ======================================================

  // Display a popup with custom title, message and actions
  function showCustomPopup(message, title = "Notice", options = {}) {
    ensureCustomPopup();

    // Get popup elements
    const backdrop = document.getElementById("customPopupBackdrop");

    const modal = document.getElementById("customPopupModal");

    const titleEl = document.getElementById("customPopupTitle");

    const bodyEl = document.getElementById("customPopupBody");

    const actionsEl = document.getElementById("customPopupActions");

    // Set popup title
    titleEl.textContent = title;

    // Set popup message
    bodyEl.innerHTML = "";

    const text = document.createElement("p");

    text.className = "mb-0";
    text.textContent = message;

    bodyEl.appendChild(text);

    // Clear previous buttons
    actionsEl.innerHTML = "";

    // ======================================================
    // Confirmation Popup
    // ======================================================

    if (options.type === "confirm") {
      // Cancel button
      const cancelBtn = document.createElement("button");

      cancelBtn.type = "button";
      cancelBtn.className = "btn btn-outline-secondary";
      cancelBtn.textContent = "Cancel";

      cancelBtn.addEventListener("click", () => {
        closeCustomPopup();

        if (typeof options.onCancel === "function") {
          options.onCancel();
        }
      });

      // Confirm button
      const confirmBtn = document.createElement("button");

      confirmBtn.type = "button";
      confirmBtn.className = "btn btn-primary";
      confirmBtn.textContent = "Confirm";

      confirmBtn.addEventListener("click", () => {
        closeCustomPopup();

        if (typeof options.onConfirm === "function") {
          options.onConfirm();
        }
      });

      actionsEl.appendChild(cancelBtn);
      actionsEl.appendChild(confirmBtn);
    }

    // ======================================================
    // Information Popup
    // ======================================================
    else {
      const okBtn = document.createElement("button");

      okBtn.type = "button";
      okBtn.className = "btn btn-primary";
      okBtn.textContent = "OK";

      okBtn.addEventListener("click", () => {
        closeCustomPopup();

        if (typeof options.onConfirm === "function") {
          options.onConfirm();
        }
      });

      actionsEl.appendChild(okBtn);
    }

    // Display popup
    backdrop.hidden = false;
    modal.hidden = false;
  }

  // ======================================================
  // Expose Popup Functions Globally
  // ======================================================

  window.closeCustomPopup = closeCustomPopup;
  window.showCustomPopup = showCustomPopup;
})();
