// ===============================
// Render Completed Tasks
// ===============================
async function renderCompletedTasks() {
  const completedTasksList = document.getElementById("completedTasksList");
  const completedEmpty = document.getElementById("completedEmpty");

  // Get only completed tasks
  const tasks = await getTasksByStatus("Completed");

  // No completed tasks
  if (!tasks.length) {
    completedTasksList.innerHTML = "";
    completedEmpty.style.display = "block";
    return;
  }

  completedEmpty.style.display = "none";

  // Display completed tasks
  completedTasksList.innerHTML = tasks.map(createTaskPreview).join("");

  // -------------------------------
  // Delete Task
  // -------------------------------
  document.querySelectorAll(".remove-task").forEach((button) => {
    button.addEventListener("click", async function () {
      await removeTask(this.dataset.taskId);

      await renderCompletedTasks();
    });
  });

  // -------------------------------
  // Change Status
  // -------------------------------
  document.querySelectorAll(".task-status").forEach((select) => {
    select.addEventListener("change", async function () {
      const taskId = this.dataset.taskId;

      const status = this.value;

      await updateTask(taskId, {
        status,
      });

      // Refresh list
      // If status is no longer "Completed",
      // it disappears from this page.
      await renderCompletedTasks();
    });
  });
}

// ===============================
// Page Load
// ===============================
document.addEventListener("DOMContentLoaded", async function () {
  window.showAppLoader?.("Loading completed tasks...");

  try {
    await renderCompletedTasks();
  } finally {
    window.hideAppLoader?.();
  }
});
