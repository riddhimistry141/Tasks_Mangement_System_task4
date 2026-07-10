// ===============================
// Dashboard JS
// ===============================

// ---------- Load Logged In User ----------
function loadUserInfo() {
  const userNameEl = document.getElementById("addUName");

  let displayName = localStorage.getItem("loggedInUserName") || "";

  const savedUserData = localStorage.getItem("loggedInUserData");

  if (!displayName && savedUserData) {
    try {
      const user = JSON.parse(savedUserData);

      displayName =
        user.fullName ||
        user.name ||
        user.userName ||
        user.username ||
        user.email ||
        "User";
    } catch (error) {
      console.error(error);
      displayName = "User";
    }
  }

  if (userNameEl) {
    userNameEl.textContent = displayName || "User";
  }

  const avatar = document.getElementById("profileAvatar");
  const avatarData = localStorage.getItem("loggedInUserAvatar");

  if (avatar && avatarData) {
    avatar.src = avatarData;
    avatar.style.display = "block";
  }
}

// ---------- Dashboard Counts ----------
async function updateDashboardCounts() {
  const counts = await getTaskCounts();

  document.getElementById("totalTasks").textContent = counts.total;

  document.getElementById("completedTasks").textContent = counts.completed;

  document.getElementById("progressTasks").textContent = counts.progress;

  document.getElementById("pendingTasks").textContent = counts.pending;
}

// ---------- Dashboard Tasks ----------//
// ===============================
// Dashboard Recent Tasks
// ===============================
async function loadDashboardTasks() {
  const container = document.getElementById("myTasks");

  const tasks = await getTasks();

  if (!tasks.length) {
    container.innerHTML = `
            <div class="text-center text-secondary py-5">
                No Tasks Available
            </div>
        `;

    return;
  }

  // show only latest 5 tasks
  container.innerHTML = tasks
    .slice(0, 5)
    .map((task) => {
      const id = getTaskId(task);

      const priorityColor =
        {
          high: "danger",
          medium: "warning",
          low: "success",
        }[task.priority?.toLowerCase()] || "secondary";

      return `

<div class="d-flex justify-content-between align-items-center border-bottom py-3">

<div>

<div class="fw-semibold">
${task.title}
</div>

<span class="badge bg-${priorityColor}">
${task.priority}
</span>

</div>

<div class="dropdown">

<button class="btn btn-sm btn-light"
data-bs-toggle="dropdown">

<i class="fa fa-ellipsis-v"></i>

</button>

<ul class="dropdown-menu dropdown-menu-end">

<li>

<button
class="dropdown-item text-danger remove-task"
data-task-id="${id}">

Delete

</button>

</li>

</ul>

</div>

</div>

`;
    })
    .join("");

  // delete buttons
  document.querySelectorAll(".remove-task").forEach((btn) => {
    btn.onclick = function () {
      const taskId = this.dataset.taskId; // Save task id before popup

      showCustomPopup("Delete this task?", "Confirm", {
        type: "confirm",

        onConfirm: async function () {
          window.showAppLoader?.("Deleting task...");

          try {
            await removeTask(taskId);

            await refreshDashboard();
          } finally {
            window.hideAppLoader?.();
          }
        },
      });
    };
  });
}

// ===============================
// Dashboard Chart
// ===============================
let taskChart;

async function loadTaskChart() {
  const counts = await getTaskCounts();

  const ctx = document.getElementById("taskChart");

  if (!ctx) return;

  if (taskChart) {
    taskChart.destroy();
  }

  taskChart = new Chart(ctx, {
    type: "doughnut",

    data: {
      labels: ["Completed", "In Progress", "Pending"],

      datasets: [
        {
          data: [counts.completed, counts.progress, counts.pending],

          backgroundColor: ["#22c55e", "#f59e0b", "#3b82f6"],
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          position: "right",
        },
      },

      cutout: "70%",
    },
  });
}

// ---------- Refresh Dashboard ----------//
async function refreshDashboard() {
  await updateDashboardCounts();

  await loadDashboardTasks();
  await loadTaskChart();
}

// ---------- Page Load ----------
document.addEventListener("DOMContentLoaded", async () => {
  loadUserInfo();

  window.showAppLoader?.("Loading dashboard...");

  try {
    await refreshDashboard();
  } finally {
    window.hideAppLoader?.();
  }
});
