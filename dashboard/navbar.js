// ======================================================
// Dashboard Navigation Items
// ======================================================

// List of all sidebar navigation links
const dashboardNavItems = [
  { label: "Dashboard", href: "dashboard.html", icon: "fa-home" },
  { label: "Profile", href: "profile.html", icon: "fa-user" },
  // { label: "Calendar", href: "calendar.html", icon: "fa-calendar" },
  { label: "My Tasks", href: "my-tasks.html", icon: "fa-tasks" },
  // { label: "Projects", href: "projects.html", icon: "fa-folder" },
  // { label: "Categories", href: "categories.html", icon: "fa-list" },
  { label: "Priority", href: "priority.html", icon: "fa-flag" },
  { label: "Completed", href: "completed.html", icon: "fa-check-circle" },
  // { label: "Reminders", href: "reminders.html", icon: "fa-bell" },
  // { label: "Notes", href: "notes.html", icon: "fa-sticky-note" },
  { label: "Settings", href: "settings.html", icon: "fa-cog" },
  {
    label: "Logout",
    href: "../login/login_page.html",
    icon: "fa-sign-out",
    action: "logout",
  },
];

// ======================================================
// Generate Sidebar Navigation
// ======================================================

function createDashboardNavbar() {
  // Get current page name
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";

  // Create navigation links
  const navLinks = dashboardNavItems
    .map((item) => {
      // Highlight active page
      const isActive = item.href === currentPage;
      const activeClass = isActive ? " active" : "";
      const currentAttr = isActive ? ' aria-current="page"' : "";

      return `
            <a class="nav-link${activeClass}"
               ${currentAttr}
               href="${item.href}"
               ${item.action ? `data-action="${item.action}"` : ""}>

                <i class="fa ${item.icon}" aria-hidden="true"></i>

                ${item.label}

            </a>
        `;
    })
    .join("");

  // Return complete Bootstrap Offcanvas Navbar
  return `
    <!-- =========================
         Desktop Sidebar
    ========================= -->
    <div class="desktop-sidebar">
    
        <div class="p-3 border-bottom text-center">
    
            <img
                class="img-fluid"
                src="../images/logo.png"
                alt="Logo"
                style="width:200px;">
    
        </div>
    
        <nav class="nav flex-column p-3">
    
            ${navLinks}
    
        </nav>
    
    </div>
    
    <!-- =========================
         Mobile Offcanvas
    ========================= -->

    <div class="offcanvas offcanvas-start "
         tabindex="-1"
         id="offcanvas"
         aria-labelledby="offcanvasLabel">

        <!-- Sidebar Header -->
        <div class="offcanvas-header">

            <!-- Application Logo -->
            <h5 class="offcanvas-title" id="offcanvasLabel">

                <img
                    class="img-fluid mb-4"
                    src="../images/logo.png"
                    alt="Logo"
                    style="width:200px;">

            </h5>

            <!-- Close Sidebar Button -->
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close">
            </button>

        </div>

        <!-- Sidebar Navigation -->
        <div class="offcanvas-body">

            <nav class="nav flex-column">

                ${navLinks}

            </nav>

        </div>

    </div>

    `;
}

// ======================================================
// Initialize Dashboard Navbar
// ======================================================

function initializeDashboardNavbar() {
  // Get navbar container
  const navbarContainer = document.getElementById("navbar-container");

  const target = navbarContainer || document.body;

  // Insert navbar only once
  if (!document.getElementById("offcanvas")) {
    target.insertAdjacentHTML(
      navbarContainer ? "afterbegin" : "beforeend",
      createDashboardNavbar(),
    );
  }

  // Get required elements
  const offcanvasEl = document.getElementById("offcanvas");

  const toggleBtn = document.querySelector(".menu-toggle");

  // Stop if Bootstrap is unavailable
  if (!offcanvasEl || !toggleBtn || typeof bootstrap === "undefined") return;

  // Create Bootstrap Offcanvas instance
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);

  // ======================================================
  // Sidebar Open Event
  // ======================================================

  toggleBtn.addEventListener("click", function () {
    toggleBtn.classList.add("is-active");

    bsOffcanvas.show();
  });

  // ======================================================
  // Sidebar Close Event
  // ======================================================

  offcanvasEl.addEventListener("hidden.bs.offcanvas", function () {
    toggleBtn.classList.remove("is-active");
  });

  // ======================================================
  // Sidebar Opened Event
  // ======================================================

  offcanvasEl.addEventListener("shown.bs.offcanvas", function () {
    toggleBtn.classList.add("is-active");
  });

  // ======================================================
  // Navigation Click Events
  // ======================================================

  document.querySelectorAll(".offcanvas .nav-link").forEach(function (link) {
    link.addEventListener("click", async function (event) {
      // ==========================================
      // Logout Action
      // ==========================================

      if (link.dataset.action === "logout") {
        event.preventDefault();

        window.showAppLoader?.("Signing out...");

        try {
          // Logout using API
          if (typeof logoutUser === "function") {
            await logoutUser();
          } else {
            // Clear Local Storage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("loggedInUserName");
            localStorage.removeItem("loggedInUserData");
            localStorage.removeItem("loggedInUserAvatar");
          }

          // Redirect to Login Page
          window.location.href = "../login/login_page.html";
        } finally {
          window.hideAppLoader?.();
        }

        return;
      }

      // Close sidebar after navigation
      bsOffcanvas.hide();
    });
  });
}

// ======================================================
// Initialize Navbar After Page Load
// ======================================================

// Wait until the page is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDashboardNavbar);
} else {
  initializeDashboardNavbar();
}
