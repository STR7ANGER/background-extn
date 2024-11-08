document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const roleSelection = document.getElementById("role-selection");
  const roleSelect = document.getElementById("role-select");
  const okButton = document.getElementById("ok-button");
  const usernameSection = document.getElementById("username-section");
  const submitNameButton = document.getElementById("submit-name");
  const userSection = document.getElementById("user-section");
  const greeting = document.getElementById("greeting");
  const appList = document.getElementById("app-list");
  const meetingLinkDisplay = document.getElementById("meeting-link-display");
  const meetingURLLink = document.getElementById("meeting-url-link");
  const adminSection = document.getElementById("admin-section");
  const adminTableBody = document.getElementById("admin-table-body");
  const submitURLButton = document.getElementById("submit-url");
  const meetingURLInput = document.getElementById("meeting-url");
  const urlStatus = document.getElementById("url-status");

  let userName = "";
  let currentRole = "";
  let adminUpdateInterval;
  let urlCheckInterval;

  // Restore user state from local storage
  restoreUserState();

  okButton.addEventListener("click", function () {
    currentRole = roleSelect.value;
    storeUserRole(currentRole);
    if (currentRole === "user") {
      roleSelection.style.display = "none";
      usernameSection.style.display = "block";
    } else if (currentRole === "admin") {
      roleSelection.style.display = "none";
      adminSection.style.display = "block";
      startAdminUpdates();
    }
  });

  submitNameButton.addEventListener("click", function () {
    userName = document.getElementById("username").value.trim();
    storeUsername(userName);
    if (userName) {
      usernameSection.style.display = "none";
      greeting.textContent = `Hello, ${userName}!`;
      userSection.style.display = "block";
      fetchUserApps();
      startUserUpdates();
    }
  });

  submitURLButton.addEventListener("click", function () {
    const url = meetingURLInput.value.trim();
    if (url) {
      submitMeetingURL(url);
      meetingURLInput.value = "";
      showUrlStatus("Meeting URL submitted successfully!");
    }
  });

  function startAdminUpdates() {
    fetchAdminData(); // Initial fetch
    adminUpdateInterval = setInterval(fetchAdminData, 10000); // Update every 10 seconds
  }

  function startUserUpdates() {
    fetchUserApps(); // Initial fetch
    fetchMeetingURL(); // Initial URL fetch
    urlCheckInterval = setInterval(() => {
      fetchUserApps();
      fetchMeetingURL();
    }, 5000); // Check every 5 seconds
  }

  function restoreUserState() {
    const storedRole = localStorage.getItem("currentRole");
    const storedUsername = localStorage.getItem("username");

    if (storedRole) {
      currentRole = storedRole;
      roleSelect.value = currentRole;
      if (currentRole === "user") {
        userSection.style.display = "block";
        usernameSection.style.display = "none";
        greeting.textContent = `Hello, ${storedUsername}!`;
        userName = storedUsername;
        fetchUserApps();
        startUserUpdates();
      } else if (currentRole === "admin") {
        adminSection.style.display = "block";
        startAdminUpdates();
      }
    } else {
      roleSelection.style.display = "block";
    }
  }

  function storeUserRole(role) {
    localStorage.setItem("currentRole", role);
  }

  function storeUsername(username) {
    localStorage.setItem("username", username);
  }

  function fetchUserApps() {
    fetch("http://127.0.0.1:5000/apps")
      .then((response) => response.json())
      .then((data) => {
        appList.innerHTML = "";
        data.forEach((appName) => {
          const li = document.createElement("li");
          li.textContent = appName;
          appList.appendChild(li);
        });
        submitUserData(userName, data);
      })
      .catch((error) => console.error("Error fetching apps:", error));
  }

  function submitUserData(username, apps) {
    fetch("http://127.0.0.1:5000/submit-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, apps }),
    })
      .then((response) => response.json())
      .then((result) => console.log("Data submitted:", result))
      .catch((error) => console.error("Error submitting data:", error));
  }

  function submitMeetingURL(url) {
    fetch("http://127.0.0.1:5000/submit-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Meeting URL submitted:", result);
        fetchAdminData();
      })
      .catch((error) => console.error("Error submitting meeting URL:", error));
  }

  function fetchMeetingURL() {
    if (!userName) return;

    fetch(`http://127.0.0.1:5000/meeting-url?username=${userName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.meeting_url) {
          meetingLinkDisplay.style.display = "block";
          meetingURLLink.href = data.meeting_url;
          meetingURLLink.textContent = data.meeting_url;
        } else {
          meetingLinkDisplay.style.display = "none";
        }
      })
      .catch((error) => console.error("Error fetching meeting URL:", error));
  }

  function fetchAdminData() {
    fetch("http://127.0.0.1:5000/admin-data")
      .then((response) => response.json())
      .then((data) => {
        adminTableBody.innerHTML = "";
        data.forEach((user) => {
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
      .catch((error) => console.error("Error fetching admin data:", error));
  }

  function showUrlStatus(message) {
    urlStatus.textContent = message;
    urlStatus.style.display = "block";
    setTimeout(() => {
      urlStatus.style.display = "none";
    }, 3000);
  }

  // Cleanup intervals when the window is closed
  window.addEventListener("beforeunload", () => {
    if (adminUpdateInterval) clearInterval(adminUpdateInterval);
    if (urlCheckInterval) clearInterval(urlCheckInterval);
  });
});
