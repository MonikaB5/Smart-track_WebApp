const API = "http://127.0.0.1:5000"

// ---------------- TAB SWITCH ----------------
function showSignup() {
    login.style.display = "none"
    signup.style.display = "block"
    signup.style.animation = "fadeUp 0.5s ease"
}

function showLogin() {
    signup.style.display = "none"
    login.style.display = "block"
    login.style.animation = "fadeUp 0.5s ease"
}

// ---------------- SIGNUP ----------------
function signup() {

    let username = document.getElementById("name").value
    let email = document.getElementById("semail").value
    let password = document.getElementById("spassword").value

    fetch(API + "/signup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
        .then(r => r.json())
        .then(d => {
            if (d.status == "success") {
                alert("Account created")
                showLogin()
            } else {
                alert("User already exists")
            }
        })

}

// ---------------- LOGIN ----------------
function login() {

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    fetch(API + "/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(r => r.json())
        .then(d => {
            if (d.status == "success") {

                localStorage.setItem("username", email)

                window.location = "dashboard.html"

            } else {
                alert("Invalid login")
            }
        })

}

// ---------------- ADD DEVICE ----------------
function addDevice() {

    let name = document.getElementById("deviceName").value
    let id = document.getElementById("deviceId").value
    let location = document.getElementById("deviceLocation").value

    if (!name || !id || !location) {
        alert("Fill all fields")
        return
    }

    fetch(API + "/add_device", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            device_id: id,
            location: location
        })
    })
        .then(r => r.json())
        .then(d => {

            if (d.status == "exists") {
                alert("Device already exists ⚠️")
                return
            }

            alert("Device Added")
            loadDevices()

        })

}

// ---------------- LOAD DEVICES ----------------
// ---------------- LOAD DEVICES ----------------
function loadDevices() {

    fetch(API + "/devices")
        .then(r => r.json())
        .then(data => {

            let html = ""
            let active = 0
            let offline = 0

            data.forEach(d => {

                active++

                html += `
<div class="device-card">
<h3>${d.name}</h3>
<p>ID: ${d.device_id}</p>
<p>Location: ${d.location}</p>

<button onclick="track('${d.location}')">
Track
</button>

</div>
`

            })

            document.getElementById("devices").innerHTML = html
            document.getElementById("totalDevices").innerText = data.length
            document.getElementById("activeDevices").innerText = active
            document.getElementById("offlineDevices").innerText = offline

        })
}
// ---------------- TRACK ----------------
function track(location) {
    window.location = "track.html?location=" + location
}

// ---------------- SETTINGS ----------------
function saveSettings() {

    let distance = document.getElementById("distance").value
    let sound = document.getElementById("sound").value

    localStorage.setItem("distance", distance)
    localStorage.setItem("sound", sound)

    alert("Settings Saved")

}

// ---------------- PAGE LOAD ----------------
window.onload = function () {

    let user = localStorage.getItem("username")

    if (document.getElementById("usernameDisplay"))
        document.getElementById("usernameDisplay").innerText = user

    loadDevices()

}
const statusSelect = document.getElementById("status-select");
const statusText = document.getElementById("status-text");
const statusIndicator = document.getElementById("status-indicator");

if (statusSelect) {
    statusSelect.addEventListener("change", () => {
        const value = statusSelect.value;

        // Update text
        statusText.textContent =
            value.charAt(0).toUpperCase() + value.slice(1);

        // Update dot color
        statusIndicator.className = "";
        statusIndicator.classList.add(value);

        // (Optional) Store in localStorage
        localStorage.setItem("userStatus", value);
    });
}

// Load saved status
const savedStatus = localStorage.getItem("userStatus");
if (savedStatus) {
    statusSelect.value = savedStatus;
    statusText.textContent =
        savedStatus.charAt(0).toUpperCase() + savedStatus.slice(1);

    statusIndicator.className = "";
    statusIndicator.classList.add(savedStatus);
}
document.addEventListener("mousemove", (event) => {
    const eyes = document.querySelectorAll(".eye");
    eyes.forEach(eye => {
        let rect = eye.getBoundingClientRect();
        let eyeX = rect.left + rect.width / 2;
        let eyeY = rect.top + rect.height / 2;

        let radian = Math.atan2(event.pageY - eyeY, event.pageX - eyeX);
        let x = Math.cos(radian) * 4;
        let y = Math.sin(radian) * 4;

        eye.style.transform = `translate(${x}px, ${y}px)`;
    });
});