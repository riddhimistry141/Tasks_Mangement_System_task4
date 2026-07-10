// ======================================================
// Application Loader Module
// ======================================================

(function () {
  // Track active loading operations
  let activeLoaders = 0;

  // ======================================================
  // Create Loader Element
  // ======================================================

  // Create the loader if it doesn't already exist
  function ensureLoader() {
    let loader = document.getElementById("appLoader");

    if (!loader) {
      loader = document.createElement("div");

      loader.id = "appLoader";
      loader.className = "app-loader";
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-live", "polite");
      loader.setAttribute("aria-hidden", "true");

      // Loader HTML structure
      loader.innerHTML = `
                <div class="app-loader__content">
                    <span class="app-loader__spinner" aria-hidden="true"></span>
                    <span class="app-loader__text">Loading...</span>
                </div>
            `;

      document.body.appendChild(loader);
    }

    return loader;
  }

  // ======================================================
  // Show Application Loader
  // ======================================================

  // Display the global loading overlay
  function showAppLoader(message) {
    activeLoaders += 1;

    const loader = ensureLoader();
    const text = loader.querySelector(".app-loader__text");

    // Update loading message
    if (text && message) {
      text.textContent = message;
    }

    loader.classList.add("is-visible");
    loader.setAttribute("aria-hidden", "false");
  }

  // ======================================================
  // Hide Application Loader
  // ======================================================

  // Hide loader after all active operations finish
  function hideAppLoader() {
    activeLoaders = Math.max(0, activeLoaders - 1);

    if (activeLoaders > 0) return;

    const loader = document.getElementById("appLoader");

    if (!loader) return;

    loader.classList.remove("is-visible");
    loader.setAttribute("aria-hidden", "true");
  }

  // ======================================================
  // Button Loading State
  // ======================================================

  // Show or remove loading state for a button
  function setButtonLoading(button, isLoading, loadingText) {
    if (!button) return;

    // Enable loading state
    if (isLoading) {
      // Save original button text
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
      }

      button.disabled = true;

      button.innerHTML = `
                <span class="btn-loader" aria-hidden="true"></span>
                <span>${loadingText || "Please wait..."}</span>
            `;

      return;
    }

    // Restore original button
    button.disabled = false;

    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;

      delete button.dataset.originalText;
    }
  }

  // ======================================================
  // Execute Function With Loader
  // ======================================================

  // Automatically show and hide the loader around async operations
  async function withAppLoader(callback, message) {
    showAppLoader(message);

    try {
      return await callback();
    } finally {
      hideAppLoader();
    }
  }

  // ======================================================
  // Expose Loader Functions Globally
  // ======================================================

  window.showAppLoader = showAppLoader;
  window.hideAppLoader = hideAppLoader;
  window.setButtonLoading = setButtonLoading;
  window.withAppLoader = withAppLoader;
})();
