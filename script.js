// ==================================================
// EARNHUB - MAIN SCRIPT
// ==================================================


// ==================================================
// SIGN UP
// ==================================================

function signup(e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    if (!nameInput || !emailInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    if (!name || !email) {
        alert("Please enter your name and email.");
        return;
    }

    const user = {
        name: name,
        email: email,
        balance: 250
    };

    localStorage.setItem(
        "earnhubUser",
        JSON.stringify(user)
    );

    alert("Account created successfully!");

    window.location.href = "dashboard.html";
}


// ==================================================
// LOGIN
// ==================================================

function login(e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");

    if (!emailInput) return;

    const email = emailInput.value.trim().toLowerCase();

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


// ==================================================
// LOGOUT
// ==================================================

function logout() {
    window.location.href = "index.html";
}


// ==================================================
// REFERRAL
// ==================================================

function copyRef() {

    const code = "ABC123";

    if (navigator.clipboard) {

        navigator.clipboard.writeText(code)
            .then(function () {
                alert("Referral code copied: " + code);
            })
            .catch(function () {
                alert("Referral code: " + code);
            });

    } else {

        alert("Referral code: " + code);
    }
}


// ==================================================
// WITHDRAW
// ==================================================

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
// ==================================================

const earnHubTasks = [

    {
        id: 1,
        title: "📱 Install an app",
        reward: 10,
        description:
            "Install the specified app and complete the required activity."
    },

    {
        id: 2,
        title: "▶️ Watch a video",
        reward: 5,
        description:
            "Watch the assigned video completely."
    },

    {
        id: 3,
        title: "📝 Complete a survey",
        reward: 15,
        description:
            "Complete the assigned survey."
    }

];


// ==================================================
// GET TASK DATA
// ==================================================

function getTaskData() {

    return JSON.parse(
        localStorage.getItem("earnhubTasks") || "{}"
    );
}


// ==================================================
// SAVE TASK DATA
// ==================================================

function saveTaskData(data) {

    localStorage.setItem(
        "earnhubTasks",
        JSON.stringify(data)
    );
}


// ==================================================
// START TASK
// ==================================================

function startTask(taskId) {

    const task = earnHubTasks.find(
        function (t) {
            return t.id === Number(taskId);
        }
    );

    if (!task) {
        alert("Task not found.");
        return;
    }

    const data = getTaskData();

    const existing = data[taskId];

    if (existing) {

        if (existing.status === "Pending") {
            alert("This task is already pending approval.");
            return;
        }

        if (existing.status === "Approved") {
            alert("You have already completed this task.");
            return;
        }

        if (existing.status === "Started") {
            alert("This task is already started.");
            return;
        }
    }

    data[taskId] = {

        taskId: task.id,

        title: task.title,

        reward: task.reward,

        description: task.description,

        status: "Started",

        startedAt: new Date().toLocaleString()

    };

    saveTaskData(data);

    alert(
        task.title +
        "\n\nTask started!\n\n" +
        "Complete the task and then submit it."
    );

    renderTasks();
}


// ==================================================
// SUBMIT TASK
// ==================================================

function submitTask(taskId) {

    const task = earnHubTasks.find(
        function (t) {
            return t.id === Number(taskId);
        }
    );

    if (!task) {
        alert("Task not found.");
        return;
    }

    const data = getTaskData();

    if (
        !data[taskId] ||
        data[taskId].status !== "Started"
    ) {

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


// ==================================================
// DISPLAY TASKS
// ==================================================

function renderTasks() {

    const container =
        document.getElementById("taskList");

    if (!container) return;

    const data = getTaskData();

    container.innerHTML = "";

    earnHubTasks.forEach(function (task) {

        const taskData = data[task.id];

        let button = "";
        let status = "";

        if (!taskData) {

            button = `
                <button
                    class="task-btn"
                    onclick="startTask(${task.id})">
                    Start Task
                </button>
            `;

        } else if (taskData.status === "Started") {

            status = `
                <div class="task-status status-started">
                    🟡 Task Started
                </div>
            `;

            button = `
                <button
                    class="task-btn"
                    onclick="submitTask(${task.id})">
                    Submit Task
                </button>
            `;

        } else if (taskData.status === "Pending") {

            status = `
                <div class="task-status status-pending">
                    ⏳ Pending Approval
                </div>
            `;

            button = `
                <button
                    class="task-btn"
                    disabled>
                    Waiting for Approval
                </button>
            `;

        } else if (taskData.status === "Approved") {

            status = `
                <div class="task-status status-approved">
                    ✓ Approved • ₹${task.reward} Added
                </div>
            `;

            button = `
                <button
                    class="task-btn"
                    disabled>
                    ✓ Completed
                </button>
            `;

        } else if (taskData.status === "Rejected") {

            status = `
                <div class="task-status status-rejected">
                    ✕ Rejected
                </div>
            `;

            button = `
                <button
                    class="task-btn"
                    onclick="startTask(${task.id})">
                    Try Again
                </button>
            `;
        }

        container.innerHTML += `

            <article class="task-card">

                <div class="task-card-top">

                    <div>

                        <h2>${task.title}</h2>

                        <p>
                            ${task.description}
                        </p>

                    </div>

                    <div class="task-reward">
                        ₹${task.reward}
                    </div>

                </div>

                <div class="task-bottom">

                    <span class="reward-label">
                        Reward
                    </span>

                    ${button}

                </div>

                ${status}

            </article>

        `;
    });
}


// ==================================================
// ADMIN - GET SUBMISSIONS
// ==================================================

function getAdminTasks() {

    const data = getTaskData();

    const submissions = [];

    Object.keys(data).forEach(function (key) {

        const task = data[key];

        if (
            task &&
            (
                task.status === "Pending" ||
                task.status === "Approved" ||
                task.status === "Rejected"
            )
        ) {

            submissions.push(task);
        }
    });

    return submissions;
}


// ==================================================
// ADMIN - APPROVE TASK
// ==================================================

function approveTask(taskId) {

    const data = getTaskData();

    const task = data[taskId];

    if (!task) {
        alert("Task not found.");
        return;
    }

    if (task.status !== "Pending") {
        alert("This task is not pending.");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("earnhubUser") || "null"
    );

    if (!user) {
        alert("No user account found.");
        return;
    }

    const reward = Number(task.reward || 0);

    user.balance =
        Number(user.balance || 0) + reward;

    localStorage.setItem(
        "earnhubUser",
        JSON.stringify(user)
    );

    task.status = "Approved";

    task.approvedAt =
        new Date().toLocaleString();

    data[taskId] = task;

    saveTaskData(data);

    alert(
        "Task approved!\n\n" +
        "₹" + reward +
        " has been added to the user's balance."
    );

    renderAdminTasks();
}


// ==================================================
// ADMIN - REJECT TASK
// ==================================================

function rejectTask(taskId) {

    const data = getTaskData();

    const task = data[taskId];

    if (!task) {
        alert("Task not found.");
        return;
    }

    if (task.status !== "Pending") {
        alert("This task is not pending.");
        return;
    }

    task.status = "Rejected";

    task.rejectedAt =
        new Date().toLocaleString();

    data[taskId] = task;

    saveTaskData(data);

    alert("Task rejected.");

    renderAdminTasks();
}


// ==================================================
// ADMIN - DISPLAY SUBMISSIONS
// ==================================================

function renderAdminTasks() {

    const container =
        document.getElementById("adminSubmissions");

    if (!container) return;

    const tasks = getAdminTasks();

    container.innerHTML = "";

    if (tasks.length === 0) {

        container.innerHTML = `

            <div class="admin-empty">

                <div class="admin-empty-icon">
                    📋
                </div>

                <h3>No task submissions</h3>

                <p>
                    Submitted tasks will appear here.
                </p>

            </div>

        `;

        return;
    }

    tasks.forEach(function (task) {

        let content = "";

        if (task.status === "Pending") {

            content = `

                <div class="admin-actions">

                    <button
                        class="approve-btn"
                        onclick="approveTask(${task.taskId})">
                        ✓ Approve
                    </button>

                    <button
                        class="reject-btn"
                        onclick="rejectTask(${task.taskId})">
                        ✕ Reject
                    </button>

                </div>

            `;

        } else if (task.status === "Approved") {

            content = `

                <div class="status-approved">
                    ✓ Approved
                </div>

            `;

        } else if (task.status === "Rejected") {

            content = `

                <div class="status-rejected">
                    ✕ Rejected
                </div>

            `;
        }

        container.innerHTML += `

            <article class="admin-card">

                <div class="admin-card-header">

                    <h3>
                        ${task.title}
                    </h3>

                    <span class="admin-reward">
                        ₹${task.reward}
                    </span>

                </div>

                <p>
                    <strong>Status:</strong>
                    ${task.status}
                </p>

                <p>
                    <strong>Started:</strong>
                    ${task.startedAt || "-"}
                </p>

                <p>
                    <strong>Submitted:</strong>
                    ${task.submittedAt || "-"}
                </p>

                ${task.approvedAt ? `
                    <p>
                        <strong>Approved:</strong>
                        ${task.approvedAt}
                    </p>
                ` : ""}

                ${task.rejectedAt ? `
                    <p>
                        <strong>Rejected:</strong>
                        ${task.rejectedAt}
                    </p>
                ` : ""}

                ${content}

            </article>

        `;
    });
}


// ==================================================
// UPDATE DASHBOARD BALANCE
// ==================================================

function updateDashboard() {

    const balanceElement =
        document.getElementById("balance");

    if (!balanceElement) return;

    const user = JSON.parse(
        localStorage.getItem("earnhubUser") || "null"
    );

    if (user) {

        balanceElement.textContent =
            Number(user.balance || 0).toFixed(0);
    }
}


// ==================================================
// UPDATE USER NAME
// ==================================================

function updateUserName() {

    const userName =
        document.getElementById("userName");

    if (!userName) return;

    const user = JSON.parse(
        localStorage.getItem("earnhubUser") || "null"
    );

    if (user) {

        userName.textContent =
            user.name + " 👋";
    }
}


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateUserName();

        updateDashboard();

        renderTasks();

        renderAdminTasks();

    }
);


   
