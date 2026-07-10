// ======================================================
// Load High Priority Tasks
// ======================================================

async function loadPriority() {
  // Fetch all high priority tasks
  const tasks = await getTasksByPriority("high");

  // Get priority task container
  const container = document.getElementById("priorityList");

  // Display empty state if no tasks exist
  if (!tasks.length) {
    container.innerHTML = "<p>No high priority tasks.</p>";
    return;
  }

  // Render priority task cards
  container.innerHTML = tasks.map(createTaskPreview).join("");

  // ======================================================
  // Handle Task Deletion
  // ======================================================

  document.querySelectorAll(".remove-task").forEach((button) => {
    button.addEventListener("click", async function () {
      // Show loading state
      window.setButtonLoading?.(this, true, "Deleting...");
      window.showAppLoader?.("Deleting task...");

      try {
        // Delete selected task
        await removeTask(this.dataset.taskId);

        // Refresh priority task list
        await loadPriority();
      } finally {
        // Hide loading state
        window.hideAppLoader?.();
        window.setButtonLoading?.(this, false);
      }
    });
  });
}

// ======================================================
// Initialize Priority Page
// ======================================================

document.addEventListener("DOMContentLoaded", async function () {
  // Show loader while fetching tasks
  window.showAppLoader?.("Loading priority tasks...");

  try {
    // Load high priority tasks
    await loadPriority();
  } finally {
    // Hide loader after loading completes
    window.hideAppLoader?.();
  }
});
