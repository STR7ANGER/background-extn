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

    okButton.addEventListener("click", function() {
        const selectedRole = roleSelect.value;

        if (selectedRole === "user") {
            roleSelection.style.display = "none";
            usernameSection.style.display = "block";
        } else if (selectedRole === "admin") {
            roleSelection.style.display = "none";
            adminSection.style.display = "block";
            fetchAdminData();
            setInterval(fetchAdminData, 5000); // Poll every 5 seconds
        }
    });

    submitNameButton.addEventListener("click", function() {
        userName = document.getElementById("username").value.trim();
        if (userName) {
            usernameSection.style.display = "none";
            greeting.textContent = `Hello, ${userName}!`;
            userSection.style.display = "block";
            fetchUserApps();
        }
    });

    function fetchUserApps() {
        fetch("http://127.0.0.1:5000/apps")
            .then(response => response.json())
            .then(data => {
                appList.innerHTML = "";
                data.forEach(appName => {
                    const li = document.createElement("li");
                    li.textContent = appName;
                    appList.appendChild(li);
                });

                // Send username and running apps to the server
                submitUserData(userName, data);
            })
            .catch(error => console.error("Error fetching apps:", error));
    }

    function submitUserData(username, apps) {
        fetch("http://127.0.0.1:5000/submit-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, apps })
        })
        .then(response => response.json())
        .then(result => console.log("Data submitted:", result))
        .catch(error => console.error("Error submitting data:", error));
    }

    function fetchAdminData() {
        fetch("http://127.0.0.1:5000/admin-data")
            .then(response => response.json())
            .then(data => {
                adminTableBody.innerHTML = ""; // Clear the table before updating
                data.forEach(user => {
                    const row = document.createElement("tr");
                    const nameCell = document.createElement("td");
                    const appsCell = document.createElement("td");

                    nameCell.textContent = user.name;
                    appsCell.textContent = user.apps.join(", ");

                    row.appendChild(nameCell);
                    row.appendChild(appsCell);
                    adminTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching admin data:", error));
    }
});
