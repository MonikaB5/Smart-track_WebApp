const API = "http://127.0.0.1:5000";

// Fetch only devices added by this user
function loadAlerts() {
    let user = localStorage.getItem("username");

    fetch(API + "/devices?user=" + user) // Backend should filter by username
        .then(res => res.json())
        .then(data => {

            if (!data.length) {
                document.getElementById("alerts").innerHTML = `<p class="no-alerts">No devices added yet</p>`;
                return;
            }

            let html = "";

            data.forEach(d => {
                let status = Math.random() > 0.5 ? "safe" : "danger"; // For demo, you can use real status
                html += `
            <div class="alert-card ${status}">
                <div class="alert-icon">${status == "safe" ? "✅" : "⚠️"}</div>
                <div>
                    <h3>${d.name}</h3>
                    <p>Status: ${status == "safe" ? "Safe" : "Out of Range"}</p>
                    <p>Location: ${d.location}</p>
                </div>
            </div>`;
            });

            document.getElementById("alerts").innerHTML = html;
        });
}

window.onload = loadAlerts;