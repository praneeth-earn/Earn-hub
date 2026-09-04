      // ===============================
// SIGN UP
// ===============================
function signup(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Please enter your name and email.");
        return;
    }

    localStorage.setItem("earnhubUser", JSON.stringify({
        name: name,
        email: email,
        balance: 250
    }));

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

    let user = JSON.parse(
        localStorage.getItem("earnhubUser") || "null"
    );

    if (!user) {
        user = {
            name: email.split("@")[0],
            email: email,
            balance: 250
        };

        localStorage.setItem(
            "earnhubUser",
            JSON.stringify(user)
        );
    }

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
    const code = "ABC123";

    if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
    }

    alert("Referral code copied: " + code);
}


// ===============================
// WITHDRAW
// ===============================
function withdraw() {
    const user = JSON.parse(
        localStorage.getItem("earnhubUser") || "null"
    );

    if (!user) {
        alert("Please login first.");
        return;
    }

    const amount = Number(
        prompt("Enter withdrawal amount (₹):")
    );

    if (!amount || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    const balance = Number(user.balance || 0);

    if (amount > balance) {
        alert("Insufficient balance.");
        return;
    }

    const upi = prompt("Enter your UPI ID:");

    if (!upi || !upi.includes("@")) {
        alert("Please enter a valid UPI ID.");
        return;
    }

    user.balance = balance - amount;

    localStorage.setItem(
        "earnhubUser",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "lastWithdrawal",
        JSON.stringify({
            amount: amount,
            upi: upi,
            status: "Pending",
            date: new Date().toLocaleString()
        })
    );

    alert(
        "Withdrawal request submitted successfully!\n\n" +
        "Amount: ₹" + amount +
        "\nUPI: " + upi +
        "\nStatus: Pending"
    );

    location.reload();
}


// ==================================================
// TASK SYSTEM
// Start Task → Complete → Submit → Pending Approval
// ==================================================

const earnHubTasks = [
    {
        id: 1,
        title: "📱 Install an app",
        reward: 10,
        description: "Install the specified app and complete the required activity."
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


// Get saved task data
function getTaskData() {
    return JSON.parse(
        localStorage.getItem("earnhubTasks") || "{}"
    );
}


// Save task data
function saveTaskData(data) {
    localStorage.setItem(
        "earnhubTasks",
        JSON.stringify(data)
    );
}


// ===============================
// START TASK
// ===============================
function startTask(taskId) {

    const task = earnHubTasks.find(
        t => t.id === Number(taskId)
    );

    if (!task) {
        alert("Task not found.");
        return;
    }

    const data = getTaskData();

    if (data[taskId]?.status === "Pending") {
        alert("This task is already pending approval.");
        return;
    }

    data[taskId] = {
        status: "Started",
        startedAt: new Date().toLocaleString(),
        reward: task.reward
    };

    saveTaskData(data);

    alert(
        task.title +
        "\n\nTask started!\n\n" +
        "Complete the task and then submit it."
    );

    renderTasks();
}


// ===============================
// SUBMIT TASK
// ===============================
function submitTask(taskId) {

    const task = earnHubTasks.find(
        t => t.id === Number(taskId)
    );

    if (!task) {
        alert("Task not found.");
        return;
    }

    const data = getTaskData();

    if (!data[taskId] ||
        data[taskId].status !== "Started") {

        alert("Please start the task first.");
        return;
    }

    data[taskId].status = "Pending";
    data[taskId].submittedAt =
        new Date().toLocaleString();

    saveTaskData(data);

    alert(
        "Task submitted successfully!\n\n" +
        "Reward: ₹" + task.reward +
        "\nStatus: Pending Approval"
    );

    renderTasks();
}


// ===============================
// DISPLAY TASKS
// ===============================
function renderTasks() {

    const container =
        document.getElementById("taskList");

    if (!container) return;

    const data = getTaskData();

    container.innerHTML = "";

    earnHubTasks.forEach(task => {

        const taskData = data[task.id];

        let button = "";

        if (!taskData) {

            button =
                `<button onclick="startTask(${task.id})">
                    Start Task
                </button>`;

        } else if (taskData.status === "Started") {

            button =
                `<button onclick="submitTask(${task.id})">
                    Submit Task
                </button>`;

        } else if (taskData.status === "Pending") {

            button =
                `<button disabled>
                    ⏳ Pending Approval
                </button>`;

        } else {

            button =
                `<button disabled>
                    ✓ Completed
                </button>`;
        }

        container.innerHTML += `
            <div class="task-card">

                <h2>${task.title}</h2>

                <p>${task.description}</p>

                <strong>Reward: ₹${task.reward}</strong>

                <br><br>

                ${button}

            </div>
        `;
    });
}


// ===============================
// PAGE LOAD
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const userName =
            document.getElementById("userName");

        if (userName) {

            const user = JSON.parse(
                localStorage.getItem("earnhubUser") || "null"
            );

            if (user) {
                userName.textContent =
                    user.name + " 👋";
            }
        }

        // Load tasks if task page is open
        renderTasks();
    }
);  
