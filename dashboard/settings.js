// ======================================================
// Settings Page Initialization
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // Delete Account
    // ======================================================

    const deleteBtn = document.getElementById("deleteAccountBtn");

    if (!deleteBtn) return;

    deleteBtn.addEventListener("click", () => {

        showCustomPopup(

            "Are you sure you want to permanently delete your account? This action cannot be undone.",

            "Delete Account",

            {

                type: "confirm",

                async onConfirm() {

                    window.showAppLoader?.("Deleting account...");

                    try {

                        // ==========================================
                        // Call Delete Account API
                        // ==========================================

                        /*
                        Replace this section with your backend API.

                        Example:

                        await deleteAccount();

                        */

                        // Remove local data
                        localStorage.clear();

                        showCustomPopup(

                            "Your account has been deleted.",

                            "Success",

                            {

                                onConfirm() {

                                    window.location.href =
                                        "../login/login_page.html";

                                }

                            }

                        );

                    } finally {

                        window.hideAppLoader?.();

                    }

                }

            }

        );

    });

});