const API = "";

// Load profile + devices
function loadSettings() {

    let user = localStorage.getItem("username");

    document.getElementById("profileName").innerText = "Hi " + user;
    document.getElementById("profileEmail").innerText = user;

    fetch(API + "/devices")
        .then(r => r.json())
        .then(data => {

            let html = "";

            data.forEach(d => {

                // Default status if API doesn't send status
                let status = d.status ? d.status : "Offline";

                let statusColor = status === "Online" ? "#43d69e" : "#ff6961";

                html += `
                <div class="device-item" style="
                    background:#141414;
                    padding:12px;
                    margin-bottom:10px;
                    border-radius:10px;
                    border:1px solid rgba(255,191,0,0.25);
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                    <div>
                        <strong style="color:#f5c542">${d.name}</strong>
                        <br>
                        <small style="color:#999">${d.device_id}</small>
                    </div>

                    <div style="text-align:right;">
                        <span style="
                            background:${statusColor};
                            padding:4px 10px;
                            border-radius:12px;
                            color:#111;
                            font-weight:bold;
                            font-size:12px;
                            margin-right:10px;
                            display:inline-block;
                            width:70px;
                            text-align:center;
                        ">
                            ${status}
                        </span>

                        <button onclick="deleteDevice('${d.device_id}')" 
                            style="
                                background:#f5c542;
                                border:none;
                                padding:8px 14px;
                                border-radius:8px;
                                cursor:pointer;
                                font-weight:bold;
                            ">
                            Delete
                        </button>
                    </div>
                </div>
                `;
            });

            document.getElementById("deviceList").innerHTML = html;

        });

}

// Delete device
function deleteDevice(id) {

    fetch(API + "/delete_device", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: id })
    })
        .then(r => r.json())
        .then(d => {
            alert("Deleted");
            loadSettings();
        });

}

// Save settings
function saveSettings() {

    let distance = document.getElementById("distance").value;
    let mode = document.getElementById("mode").value;
    let map = document.getElementById("mapType").value;

    localStorage.setItem("distance", distance);
    localStorage.setItem("mode", mode);
    localStorage.setItem("map", map);

    alert("Settings Saved ✅");

}

// Logout
function logout() {
    localStorage.clear();
    window.location = "index.html";
}

window.onload = loadSettings;