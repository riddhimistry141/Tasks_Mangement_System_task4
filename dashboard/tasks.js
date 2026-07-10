// ======================================================
// Task Storage Configuration
// ======================================================

// Local Storage key used when API is unavailable
const TASKS_STORAGE_KEY = "taskManagerTasks";

// ======================================================
// Authentication Helpers
// ======================================================

// Get logged-in user's access token
function getAuthToken() {
  return localStorage.getItem("accessToken");
}

// ======================================================
// Local Storage Operations
// ======================================================

// Get tasks from Local Storage
function getFallbackTasks() {
  const raw = localStorage.getItem(TASKS_STORAGE_KEY);

  if (!raw) return [];

  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("Failed to parse saved tasks", error);
    return [];
  }
}

// Save tasks to Local Storage
function saveFallbackTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

// ======================================================
// Utility Functions
// ======================================================

// Return task id regardless of backend format
function getTaskId(task) {
  return task.id || task._id || task.taskId || "";
}

// Create authentication headers for API requests
function buildAuthHeaders() {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// ======================================================
// API Request Helper
// ======================================================

// Common fetch wrapper for all API requests
async function apiFetch(path, options = {}) {
  const requestOptions = {
    headers: {
      ...buildAuthHeaders(),
      ...(options.headers || {}),
    },

    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${path}`, requestOptions);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data,
        error: data?.message || data?.error || "Request failed",
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
}

// ======================================================
// Fetch All Tasks
// ======================================================

// Retrieve all tasks from API or Local Storage
async function getTasks() {
  const token = getAuthToken();

  if (!token) {
    return getFallbackTasks();
  }

  const result = await apiFetch("/tasks");

  return result.success ? result.data : getFallbackTasks();
}

// ======================================================
// Add New Task
// ======================================================

// Create a new task
async function addTask(task) {
  const token = getAuthToken();

  const payload = {
    title: task.title,
    description: task.description,
    priority: task.priority || "medium",
    category: task.category,
    dueDate: task.dueDate,
    status: task.status || "Pending",
  };

  // Local Storage Mode
  if (!token) {
    const tasks = getFallbackTasks();

    tasks.unshift({
      ...task,
      status: task.status || "Pending",
    });

    saveFallbackTasks(tasks);

    return task;
  }

  // API Mode
  const result = await apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return result.success ? result.data : null;
}

// ======================================================
// Delete Task
// ======================================================

// Remove a task
async function removeTask(taskId) {
  const token = getAuthToken();

  if (!token) {
    const tasks = getFallbackTasks().filter(
      (task) => getTaskId(task) !== taskId,
    );

    saveFallbackTasks(tasks);

    return tasks;
  }

  const result = await apiFetch(`/tasks/${taskId}`, {
    method: "DELETE",
  });

  return result.success ? await getTasks() : null;
}

// ======================================================
// Update Existing Task
// ======================================================

// Update task information
async function updateTask(taskId, changes) {
  const token = getAuthToken();

  if (!token) {
    const tasks = getFallbackTasks().map((task) =>
      getTaskId(task) === taskId ? { ...task, ...changes } : task,
    );

    saveFallbackTasks(tasks);

    return tasks;
  }

  const result = await apiFetch(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });

  return result.success ? result.data : null;
}
// ======================================================
// Update Task Status
// ======================================================

// Update only the status of an existing task
async function updateTaskStatus(taskId, status) {
  const token = getAuthToken();

  // Local Storage Mode
  if (!token) {
    return updateTask(taskId, { status });
  }

  // API Mode
  const result = await apiFetch(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  return result.success ? result.data : null;
}

// ======================================================
// Dashboard Statistics
// ======================================================

// Calculate task counts for dashboard cards
async function getTaskCounts() {
  // Fetch all tasks
  const tasks = await getTasks();

  // Return task statistics
  return {
    // Total number of tasks
    total: tasks.length,

    // Completed tasks
    completed: tasks.filter(
      (task) => task.status?.toLowerCase() === "completed",
    ).length,

    // Tasks currently in progress
    progress: tasks.filter(
      (task) => task.status?.toLowerCase() === "in-progress",
    ).length,

    // Pending tasks
    pending: tasks.filter((task) => task.status?.toLowerCase() === "pending")
      .length,
  };
}

// ======================================================
// Filter Tasks by Status
// ======================================================

// Return tasks that match the selected status
async function getTasksByStatus(status) {
  const tasks = await getTasks();

  return tasks.filter(
    (task) => (task.status || "").toLowerCase() === status.toLowerCase(),
  );
}

/*
// ======================================================
// Future Features (Currently Disabled)
// ======================================================

// Filter tasks by category
async function getTasksByCategory(category) {

  const tasks = await getTasks();

  return tasks.filter(
    (task) => task.category === category
  );

}

// Format task due date
function formatTaskDueDate(dateString) {

  if (!dateString) return "No date";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime()))
    return "Invalid date";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

}
*/

// ======================================================
// Filter Tasks by Priority
// ======================================================

// Return tasks that match the selected priority
async function getTasksByPriority(priority) {
  const token = getAuthToken();

  // Local Storage Mode
  if (!token) {
    return getFallbackTasks().filter((task) => task.priority === priority);
  }

  // API Mode
  const result = await apiFetch(`/tasks?priority=${priority}`);

  return result.success ? result.data : [];
}
// ======================================================
// Task Card Template
// ======================================================

// Generate HTML for a single task card
function createTaskPreview(task) {
  // Get unique task ID
  const id = getTaskId(task);

  // Return task card
  return `

    <!-- Task Card -->
    <div class="card shadow-sm border-0 rounded-4 mb-3">

        <div class="card-body">

            <!-- ==========================================
                 Task Header
            ========================================== -->
            <div class="d-flex justify-content-between align-items-start">

                <!-- Task Details -->
                <div>

                    <!-- Task Title -->
                    <h5 class="mb-1 fw-bold">
                        ${task.title}
                    </h5>

                    <!-- Task Description -->
                    <small class="text-muted">
                        ${task.description || "No description"}
                    </small>

                </div>

                <!-- ==========================================
                     Task Status Dropdown
                ========================================== -->
                <select
                    class="form-select form-select-sm task-status"
                    data-task-id="${id}"
                    style="width:170px">

                    <option
                        value="pending"
                        ${task.status === "pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option
                        value="in-progress"
                        ${task.status === "in-progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option
                        value="completed"
                        ${task.status === "completed" ? "selected" : ""}>
                        Completed
                    </option>

                </select>

            </div>

            <hr class="my-3">

            <!-- ==========================================
                 Task Footer
            ========================================== -->
            <div class="d-flex justify-content-between align-items-center">

                <!-- Task Labels -->
                <div>

                    <!-- Priority Badge -->
                    <span class="badge bg-primary">
                        ${task.priority.toUpperCase()}
                    </span>

                    <!-- Category Badge -->
                    ${
                      task.category
                        ? `<span class="badge bg-light text-dark ms-2">
                                ${task.category}
                           </span>`
                        : ""
                    }

                </div>

                <!-- Delete Button -->
                <button
                    class="btn btn-sm btn-outline-danger remove-task"
                    data-task-id="${id}">

                    <i class="fa-solid fa-trash"></i>
                    Delete

                </button>

            </div>

        </div>

    </div>

    `;
}
