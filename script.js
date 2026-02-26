// ─────────────────────────────────────────
// HELPER: Show error message in form
// ─────────────────────────────────────────
function showError(id, message) {
    const box = document.getElementById(id);
    if (box) {
        box.style.display = "block";
        box.textContent = message;
    }
}

function hideError(id) {
    const box = document.getElementById(id);
    if (box) box.style.display = "none";
}

// ─────────────────────────────────────────
// HELPER: Set button loading state
// ─────────────────────────────────────────
function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? "Please wait..." : btn.dataset.label;
}

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    // Save original button label
    const btn = document.getElementById("registerBtn");
    if (btn) btn.dataset.label = btn.textContent;

    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        hideError("errorMsg");

        const username = document.getElementById("username").value.trim();
        const email    = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirm  = document.getElementById("confirmPassword").value;

        // Validate passwords match
        if (password !== confirm) {
            showError("errorMsg", "❌ Passwords do not match.");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showError("errorMsg", "❌ Password must be at least 6 characters.");
            return;
        }

        // Check if email already registered
        const existing = JSON.parse(localStorage.getItem("flUsers") || "[]");
        const alreadyExists = existing.find(u => u.email === email);

        if (alreadyExists) {
            showError("errorMsg", "❌ This email is already registered.");
            return;
        }

        setLoading("registerBtn", true);

        // Store user (NOTE: in production, NEVER store passwords client-side)
        // You would send this to your server instead
        const newUser = { username, email, password };
        existing.push(newUser);
        localStorage.setItem("flUsers", JSON.stringify(existing));

        setTimeout(() => {
            alert("✅ Account created successfully! Please login.");
            window.location.href = "login.html";
        }, 500);

    });
}

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const btn = document.getElementById("loginBtn");
    if (btn) btn.dataset.label = btn.textContent;

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        hideError("errorMsg");

        const email    = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const users = JSON.parse(localStorage.getItem("flUsers") || "[]");
        const user  = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Save session
            localStorage.setItem("flLoggedIn", "true");
            localStorage.setItem("flCurrentUser", JSON.stringify(user));

            setLoading("loginBtn", true);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);

        } else {
            showError("errorMsg", "❌ Incorrect email or password.");
        }

    });
}

// ─────────────────────────────────────────
// DASHBOARD AUTH GUARD
// Redirect to login if not logged in
// ─────────────────────────────────────────
if (window.location.pathname.includes("dashboard")) {

    const loggedIn = localStorage.getItem("flLoggedIn");

    if (!loggedIn) {
        // Not logged in — send them away
        window.location.href = "login.html";
    } else {
        // Show username in navbar and header
        const user = JSON.parse(localStorage.getItem("flCurrentUser") || "{}");

        const navName  = document.getElementById("navUsername");
        const welcomeName = document.getElementById("welcomeName");

        if (navName)     navName.textContent     = user.username || "";
        if (welcomeName) welcomeName.textContent  = user.username || "Trader";
    }
}

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
function logout() {
    localStorage.removeItem("flLoggedIn");
    localStorage.removeItem("flCurrentUser");
    window.location.href = "index.html";
}

// ─────────────────────────────────────────
// SELECT PLAN
// ─────────────────────────────────────────
function selectPlan(plan) {
    localStorage.setItem("selectedPlan", plan);
    alert("Plan selected: " + plan + "\nProceed to payment.");
} 

// PREVIEW SCREENSHOT
function previewImage(input, previewId, labelId) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        const imgId = previewId === "beforePreview" ? "beforeImg" : "afterImg";
        document.getElementById(imgId).src = e.target.result;
        preview.style.display = "block";
        document.getElementById(labelId).style.display = "none";
    };
    reader.readAsDataURL(file);
}

// CLEAR SCREENSHOT
function clearImage(previewId, labelId, inputId) {
    document.getElementById(previewId).style.display = "none";
    document.getElementById(labelId).style.display = "flex";
    document.getElementById(inputId).value = "";
}