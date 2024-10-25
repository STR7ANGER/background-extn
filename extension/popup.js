document.addEventListener("DOMContentLoaded", function() {
    fetch("http://127.0.0.1:5000/apps")
        .then(response => response.json())
        .then(data => {
            const appList = document.getElementById("app-list");
            data.forEach(appName => {
                const li = document.createElement("li");
                li.textContent = appName;
                appList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching apps:", error));
});
