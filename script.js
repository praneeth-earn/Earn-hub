/* ==================================================
   EARNHUB - MAIN JAVASCRIPT
   ================================================== */


/* ==================================================
   TASK DATABASE
   ================================================== */

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


/* ==================================================
   USER
   ================================================== */

function getUser() {

    return JSON.parse(
        localStorage.getItem("earnhubUser") || "null"
    );

}


function saveUser(user) {

    localStorage.setItem(
        "earnhubUser",
        JSON.stringify(user)
    );

}


/* ==================================================
   SIGN UP
   ================================================== */

function signup(e) {

    e.preventDefault();

    const nameElement =
        document.getElementById("name");

    const emailElement =
        document.getElementById("email");


    if (!nameElement || !emailElement) {
        return;
    }


    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim();


    if (!name || !email) {

        alert(
            "Please enter your name and email."
        );

        return;
    }


    const user = {

        name: name,

        email: email,

        balance: 250,

        taskEarnings: 0,

        referralEarnings: 0,

        adEarnings: 0,

        createdAt:
            new Date().toLocaleString()

    };


    saveUser(user);


    alert(
        "Account created successfully!"
    );


    window.location.href =
        "dashboard.html";

}


/* ==================================================
   LOGIN
   ================================================== */

function login(e) {

    e.preventDefault();


    const emailElement =
        document.getElementById("loginEmail");


    if (!emailElement) {
        return;
    }


    const email =
        emailElement.value.trim();


    if (!email) {

        alert(
            "Please enter your email."
        );

        return;
    }


    let user = getUser();


    if (!user) {

        user = {

            name:
                email
                    .split("@")[0],

            email: email,

            balance: 250,

            taskEarnings: 0,

            referralEarnings: 0,

            adEarnings: 0

        };


        saveUser(user);

    }


    window.location.href =
        "dashboard.html";

}


/* ==================================================
   LOGOUT
   ================================================== */

function logout() {

    window.location.href =
        "index.html";

}


/* ==================================================
   REFERRAL
   ================================================== */

function copyRef() {

    const code =
        "ABC123";


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(code)
            .then(function () {

                alert(
                    "Referral code copied: " +
                    code
                );

            })
            .catch(function () {

                alert(
                    "Your referral code is: " +
                    code
                );

            });

    } else {

        alert(
            "Your referral code is: " +
            code
        );

    }

}


/* ==================================================
   WITHDRAW
   ================================================== */

function withdraw() {

    const user =
        getUser();


    if (!user) {

        alert(
            "Please login first."
        );

        return;
    }


    const amount =
        Number(
            prompt(
                "Enter withdrawal amount (₹):"
            )
        );


    if (!amount || amount <= 0) {

        alert(
            "Enter a valid amount."
        );

        return;
    }


    const balance =
        Number(user.balance || 0);


    if (amount > balance) {

        alert(
            "Insufficient balance."
        );

        return;
    }


    const upi =
        prompt(
            "Enter your UPI ID:"
        );


    if (
        !upi ||
        !upi.includes("@")
    ) {

        alert(
            "Please enter a valid UPI ID."
        );

        return;
    }


    user.balance =
        balance - amount;


    saveUser(user);


    const withdrawal = {

        amount: amount,

        upi: upi,

        status: "Pending",

        date:
            new Date()
                .toLocaleString()

    };


    localStorage.setItem(
        "lastWithdrawal",
        JSON.stringify(withdrawal)
    );


    addActivity({

        type: "withdrawal",

        title:
            "Withdrawal request",

        amount:
            -amount,

        date:
            new Date()
                .toLocaleString()

    });


    alert(

        "Withdrawal request submitted!\n\n" +

        "Amount: ₹" +
        amount +

        "\nUPI: " +
        upi +

        "\nStatus: Pending"

    );


    location.reload();

}


/* ==================================================
   TASK DATA
   ================================================== */

function getTaskData() {

    return JSON.parse(

        localStorage.getItem(
            "earnhubTasks"
        ) || "{}"

    );

}


function saveTaskData(data) {

    localStorage.setItem(

        "earnhubTasks",

        JSON.stringify(data)

    );

}


/* ==================================================
   START TASK
   ================================================== */

function startTask(taskId) {

    const task =
        earnHubTasks.find(

            t =>
                t.id ===
                Number(taskId)

        );


    if (!task) {

        alert(
            "Task not found."
        );

        return;
    }


    const data =
        getTaskData();


    const current =
        data[taskId];


    if (
        current &&
        current.status ===
        "Pending"
    ) {

        alert(
            "This task is already pending approval."
        );

        return;
    }


    if (
        current &&
        current.status ===
        "Approved"
    ) {

        alert(
            "This task has already been completed."
        );

        return;
    }


    data[taskId] = {

        status: "Started",

        startedAt:
            new Date()
                .toLocaleString(),

        reward:
            task.reward,

        title:
            task.title

    };


    saveTaskData(data);


    alert(

        task.title +

        "\n\nTask started!\n\n" +

        "Complete the task and then submit it."

    );


    renderTasks();

}


/* ==================================================
   SUBMIT TASK
   ================================================== */

function submitTask(taskId) {

    const task =
        earnHubTasks.find(

            t =>
                t.id ===
                Number(taskId)

        );


    if (!task) {

        alert(
            "Task not found."
        );

        return;
    }


    const data =
        getTaskData();


    if (
        !data[taskId] ||
        data[taskId].status !==
        "Started"
    ) {

        alert(
            "Please start the task first."
        );

        return;
    }


    data[taskId].status =
        "Pending";


    data[taskId].submittedAt =
        new Date()
            .toLocaleString();


    saveTaskData(data);


    alert(

        "Task submitted successfully!\n\n" +

        "Reward: ₹" +
        task.reward +

        "\nStatus: Pending Approval"

    );


    renderTasks();

}


/* ==================================================
   ADMIN - APPROVE TASK
   ================================================== */

function approveTask(taskId) {

    const task =
        earnHubTasks.find(

            t =>
                t.id ===
                Number(taskId)

        );


    if (!task) {
        return;
    }


    const data =
        getTaskData();


    if (
        !data[taskId] ||
        data[taskId].status !==
        "Pending"
    ) {

        alert(
            "This task is not pending."
        );

        return;
    }


    data[taskId].status =
        "Approved";


    data[taskId].approvedAt =
        new Date()
            .toLocaleString();


    saveTaskData(data);


    const user =
        getUser();


    if (user) {

        user.balance =
            Number(user.balance || 0)
            + task.reward;


        user.taskEarnings =
            Number(user.taskEarnings || 0)
            + task.reward;


        saveUser(user);

    }


    addActivity({

        type: "task",

        title:
            "Task reward: " +
            task.title,

        amount:
            task.reward,

        date:
            new Date()
                .toLocaleString()

    });


    alert(
        "Task approved!\n₹" +
        task.reward +
        " added to the balance."
    );


    renderAdmin();

}


/* ==================================================
   ADMIN - REJECT TASK
   ================================================== */

function rejectTask(taskId) {

    const data =
        getTaskData();


    if (
        !data[taskId] ||
        data[taskId].status !==
        "Pending"
    ) {

        alert(
            "This task is not pending."
        );

        return;
    }


    data[taskId].status =
        "Rejected";


    data[taskId].rejectedAt =
        new Date()
            .toLocaleString();


    saveTaskData(data);


    alert(
        "Task rejected."
    );


    renderAdmin();

}


/* ==================================================
   RENDER TASKS
   ================================================== */

function renderTasks() {

    const container =
        document.getElementById(
            "taskList"
        );


    if (!container) {
        return;
    }


    const countElement =
        document.getElementById(
            "taskCount"
        );


    const data =
        getTaskData();


    container.innerHTML =
        "";


    if (countElement) {

        countElement.textContent =
            earnHubTasks.length;

    }


    earnHubTasks.forEach(
        function(task) {

            const taskData =
                data[task.id];


            let statusClass =
                "available";

            let statusText =
                "Available";

            let buttonHTML =
                `
                <button
                    class="task-btn"
                    onclick="startTask(${task.id})">

                    Start Task

                </button>
                `;


            if (
                taskData &&
                taskData.status ===
                "Started"
            ) {

                statusClass =
                    "started";

                statusText =
                    "Started";

                buttonHTML =
                    `
                    <button
                        class="task-btn"
                        onclick="submitTask(${task.id})">

                        Submit Task

                    </button>
                    `;

            }


            if (
                taskData &&
                taskData.status ===
                "Pending"
            ) {

                statusClass =
                    "pending";

                statusText =
                    "Pending Approval";

                buttonHTML =
                    `
                    <button
                        class="task-btn"
                        disabled>

                        ⏳ Pending Approval

                    </button>
                    `;

            }


            if (
                taskData &&
                taskData.status ===
                "Approved"
            ) {

                statusClass =
                    "approved";

                statusText =
                    "Approved";

                buttonHTML =
                    `
                    <button
                        class="task-btn"
                        disabled>

                        ✓ Completed

                    </button>
                    `;

            }


            if (
                taskData &&
                taskData.status ===
                "Rejected"
            ) {

                statusClass =
                    "rejected";

                statusText =
                    "Rejected";

                buttonHTML =
                    `
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

                        <h2>
                            ${task.title}
                        </h2>

                        <span
                            class="task-status ${statusClass}">

                            ${statusText}

                        </span>

                    </div>


                    <p>
                        ${task.description}
                    </p>


                    <div class="task-bottom">

                        <div>

                            <span class="reward-label">
                                Reward
                            </span>

                            <div
                                class="task-reward">

                                ₹${task.reward}

                            </div>

                        </div>


                        <div>

                            ${buttonHTML}

                        </div>

                    </div>

                </article>

            `;

        }
    );

}


/* ==================================================
   ADMIN RENDER
   ================================================== */

function renderAdmin() {

    const container =
        document.getElementById(
            "adminSubmissions"
        );


    if (!container) {
        return;
    }


    const data =
        getTaskData();


    const submissions =
        earnHubTasks.filter(
            function(task) {

                return (
                    data[task.id] &&
                    (
                        data[task.id].status ===
                        "Pending" ||

                        data[task.id].status ===
                        "Approved" ||

                        data[task.id].status ===
                        "Rejected"
                    )
                );

            }
        );


    if (submissions.length === 0) {

        container.innerHTML = `

            <div class="admin-empty">

                <div class="admin-empty-icon">
                    📋
                </div>

                <h3>
                    No submissions yet
                </h3>

                <p>
                    Submitted tasks will appear here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        "";


    submissions.forEach(
        function(task) {

            const submission =
                data[task.id];


            let statusHTML =
                "";


            let actionHTML =
                "";


            if (
                submission.status ===
                "Pending"
            ) {

                statusHTML =
                    `
                    <span
                        class="status-pending">

                        ⏳ Pending Approval

                    </span>
                    `;


                actionHTML =
                    `
                    <div class="admin-actions">

                        <button
                            class="approve-btn"
                            onclick="approveTask(${task.id})">

                            ✓ Approve

                        </button>


                        <button
                            class="reject-btn"
                            onclick="rejectTask(${task.id})">

                            ✕ Reject

                        </button>

                    </div>
                    `;

            }


            if (
                submission.status ===
                "Approved"
            ) {

                statusHTML =
                    `
                    <span
                        class="status-approved">

                        ✓ Approved

                    </span>
                    `;

            }


            if (
                submission.status ===
                "Rejected"
            ) {

                statusHTML =
                    `
                    <span
                        class="status-rejected">

                        ✕ Rejected

                    </span>
                    `;

            }


            container.innerHTML += `

                <article class="admin-card">

                    <div class="admin-card-header">

                        <h3>
                            ${task.title}
                        </h3>

                        <span
                            class="admin-reward">

                            ₹${task.reward}

                        </span>

                    </div>


                    <p>
                        <strong>
                            Description:
                        </strong>
                        ${task.description}
                    </p>


                    <p>
                        <strong>
                            Started:
                        </strong>
                        ${
                            submission.startedAt ||
                            "Not available"
                        }
                    </p>


                    <p>
                        <strong>
                            Submitted:
                        </strong>
                        ${
                            submission.submittedAt ||
                            "Not available"
                        }
                    </p>


                    ${statusHTML}

                    ${actionHTML}

                </article>

            `;

        }
    );

}


/* ==================================================
   ACTIVITY SYSTEM
   ================================================== */

function getActivities() {

    return JSON.parse(

        localStorage.getItem(
            "earnhubActivity"
        ) || "[]"

    );

}


function saveActivities(activities) {

    localStorage.setItem(

        "earnhubActivity",

        JSON.stringify(activities)

    );

}


function addActivity(activity) {

    const activities =
        getActivities();


    activities.unshift(activity);


    if (activities.length > 20) {

        activities.length = 20;

    }


    saveActivities(activities);

}


/* ==================================================
   RENDER ACTIVITY
   ================================================== */

function renderActivity() {

    const container =
        document.getElementById(
            "recentActivity"
        );


    if (!container) {
        return;
    }


    const activities =
        getActivities();


    if (activiti
