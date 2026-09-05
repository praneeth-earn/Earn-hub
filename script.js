// ===============================
// EARNHUB - SIMPLE SCRIPT
// ===============================

function getUser() {
    return JSON.parse(localStorage.getItem("earnhubUser") || "null");
}

function saveUser(user) {
    localStorage.setItem("earnhubUser", JSON.stringify(user));
}


// ===============================
// SIGN UP
// ===============================

function signup(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Please enter name and email.");
        return;
    }

    saveUser({
        name: name,
        email: email,
        balance: 250
    });

    alert("Account created successfully!");
    window.location.href = "dashboard.html";
}


// ===============================
// LOGIN
// ===============================

function login(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    let user = getUser();

    // Create account automatically if none exists
    if (!user) {
        user = {
            name: email.split("@")[0],
            email: email,
            balance: 250
        };

        saveUser(user);
    }

    // Update email if user logs in with another email
    user.email = email;
    saveUser(user);

    window.location.href = "dashboard.html";
}


// ===============================
// LOGOUT
// ===============================

function logout() {
    window.location.href = "index.html";
}


// ===============================
// REFERRAL
// ===============================

function copyRef() {
    navigator.clipboard?.writeText("ABC123");
    alert("Referral code: ABC123");
}


// ===============================
// WITHDRAW
// ===============================

function withdraw() {
    const user = getUser();

    if (!user) {
        alert("Please login first.");
        return;
    }

    const amount = Number(prompt("Enter withdrawal amount:"));

    if (!amount || amount <= 0) {
        alert("Invalid amount.");
        return;
    }

    if (amount > Number(user.balance || 0)) {
        alert("Insufficient balance.");
        return;
    }

    const upi = prompt("Enter UPI ID:");

    if (!upi || !upi.includes("@")) {
        alert("Invalid UPI ID.");
        return;
    }

    user.balance -= amount;
    saveUser(user);

    localStorage.setItem("lastWithdrawal", JSON.stringify({
        amount: amount,
        upi: upi,
        status: "Pending"
    }));

    alert("Withdrawal submitted!");
    location.reload();
}


// ===============================
// TASKS
// ===============================

const tasks = [
    {
        id: 1,
        title: "📱 Install an app",
        reward: 10,
        description: "Install the specified app and complete the activity."
    },
    {
        id: 2,
        title: "▶️ Watch a video",
        reward: 5,
        description: "Watch the assigned video completely."
    },
    {
        id: 3,
        title: "📝 Complete a survey",
        reward: 15,
        description: "Complete the assigned survey."
    }
];

function getTasks() {
    return JSON.parse(localStorage.getItem("earnhubTasks") || "{}");
}

function saveTasks(data) {
    localStorage.setItem("earnhubTasks", JSON.stringify(data));
}

function startTask(id) {
    const data = getTasks();

    data[id] = {
        status: "Started",
        time: new Date().toLocaleString()
    };

    saveTasks(data);
    renderTasks();

    alert("Task started. Complete it and submit.");
}

function submitTask(id) {
    const data = getTasks();

    if (!data[id] || data[id].status !== "Started") {
        alert("Start the task first.");
        return;
    }

    data[id].status = "Pending";
    data[id].submitted = new Date().toLocaleString();

    saveTasks(data);
    renderTasks();

    alert("Task submitted for approval.");
}

function renderTasks() {
    const box = document.getElementById("taskList");

    if (!box) return;

    const data = getTasks();

    box.innerHTML = tasks.map(task => {

        const status = data[task.id]?.status || "Available";

        let button;

        if (status === "Available") {
            button = `<button class="task-btn" onclick="startTask(${task.id})">Start Task</button>`;
        } 
        else if (status === "Started") {
            button = `<button class="task-btn" onclick="submitTask(${task.id})">Submit Task</button>`;
        } 
        else {
            button = `<button class="task-btn" disabled>⏳ ${status}</button>`;
        }

        return `
            <div class="task-card">
                <h2>${task.title}</h2>
                <p>${task.description}</p>
                <strong>₹${task.reward}</strong>
                <br>
                ${button}
            </div>
        `;
    }).join("");
}


// ===============================
// DASHBOARD
// ===============================

function loadDashboard() {
    const user = getUser();

    if (!user) return;

    const name = document.getElementById("userName");
    const balance = document.getElementById("balance");

    if (name) {
        name.textContent = user.name + " 👋";
    }

    if (balance) {
        balance.textContent = Number(user.balance || 0);
    }
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    loadDashboard();
    renderTasks();
});
