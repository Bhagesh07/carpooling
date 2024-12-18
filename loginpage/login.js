document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const roleSelect = document.getElementById("role");

    authForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = roleSelect.value;

        if (!username || !password || !role) {
            alert("Please fill in all fields and select a role.");
            return;
        }

        // Simulate authentication
        if (role === "user") {
            // Redirect to user portal
            window.location.href = "/pages/home/index.html";
        } else if (role === "driver") {
            // Redirect to driver portal
            window.location.href = "/pages/dashboard/index.html";
        } else {
            alert("Invalid role selected. Please try again.");
        }
    });

    // Prevent access to portals without role selection
    const userPortalButton = document.querySelector("a[href='/pages/home/index.html']");
    const driverPortalButton = document.querySelector("a[href='/pages/dashboard/index.html']");

    userPortalButton.addEventListener("click", (event) => {
        if (roleSelect.value !== "user") {
            event.preventDefault();
            alert("Please select 'User' as your role to access the User Portal.");
        }
    });

    driverPortalButton.addEventListener("click", (event) => {
        if (roleSelect.value !== "driver") {
            event.preventDefault();
            alert("Please select 'Driver' as your role to access the Driver Portal.");
        }
    });
});
