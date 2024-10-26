document.addEventListener("DOMContentLoaded", function() {
    const roleSelection = document.getElementById("role-selection");
    const roleSelect = document.getElementById("role-select");
    const okButton = document.getElementById("ok-button");

    const usernameSection = document.getElementById("username-section");
    const submitNameButton = document.getElementById("submit-name");

    const userSection = document.getElementById("user-section");
    const greeting = document.getElementById("greeting");
    const appList = document.getElementById("app-list");

    const adminSection = document.getElementById("admin-section");
    const adminTableBody = document.getElementById("admin-table-body");

    let userName = "";

    // Handle OK button click based on the selected role
    okButton.addEventListener("click", function() {
        const selectedRole = roleSelect.value;

        if (selectedRole === "user") {
            // Clear the popup and show the username input for the user
            roleSelection.style.display = "none";
            usernameSection.style.display = "block";
        } else if (selectedRole === "admin") {
            // Show admin table directly
            roleSelection.style.display = "none";
            adminSection.style.display = "block";
            fetchAdminData();
        }
    });

    // Handle Submit button for user name
    submitNameButton.addEventListener("click", function() {
        userName = document.getElementById("username").value;
        if (userName) {
            // Clear the popup, show greeting, and fetch user applications
            usernameSection.style.display = "none";
            greeting.textContent = `Hello, ${userName}!`;
            userSection.style.display = "block";
            fetchUserApps();
        }
    });

    // Fetch running apps for User
    function fetchUserApps() {
        fetch("http://127.0.0.1:5000/apps")
            .then(response => response.json())
            .then(data => {
                appList.innerHTML = "";  // Clear any previous apps
                data.forEach(appName => {
                    const li = document.createElement("li");
                    li.textContent = appName;
                    appList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching apps:", error));
    }

    // Fetch data for Admin (e.g., list of users and their apps)
    function fetchAdminData() {
        fetch("http://127.0.0.1:5000/admin-data")  // Modify to match your backend endpoint for admin data
            .then(response => response.json())
            .then(data => {
                adminTableBody.innerHTML = "";  // Clear any previous entries
                data.forEach(user => {
                    const row = document.createElement("tr");
                    const nameCell = document.createElement("td");
                    nameCell.textContent = user.name;
                    const appsCell = document.createElement("td");
                    appsCell.textContent = user.apps.join(", ");
                    row.appendChild(nameCell);
                    row.appendChild(appsCell);
                    adminTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching admin data:", error));
    }
});
