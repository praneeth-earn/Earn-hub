// ==================================================
// EARNHUB SCRIPT
// ==================================================


// ==================================================
// SIGN UP
// ==================================================

function signup(e) {

    e.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();


    if (!name || !email) {

        alert("Please enter your name and email.");

        return;
    }


    const user = {

        name: name,

        email: email,

        balance: 250,

        taskEarnings: 0,

        createdAt:
            new Date().toLocaleString()

    };


    localStorage.setItem(
        "earnhubUser",
        JSON.stringify(user)
    );


    alert("Account created successfully!");


    window.location.href =
        "dashboard.html";
}



// ==================================================
// LOGIN
// ==================================================

function login(e) {

    e.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();


    if (!email) {

        alert("Please enter your email.");

        return;
    }


    let user =
        JSON.parse(
            localStorage.getItem("earnhubUser") || "null"
        );


    if (!user) {

        user = {

            name:
                email.split("@")[0],

            email:
                email,

            balance: 250,

            taskEarnings: 0,

            createdAt:
                new Date().toLocaleString()

        };


        localStorage.setItem(
            "earnhubUser",
            JSON.stringify(user)
        );

    }


    window.location.href =
        "dashboard.html";
}



// ==================================================
// LOGOUT
// ==================================================

function logout() {

    window.location.href =
        "index.html";
}



// ==================================================
// REFERRAL
// ==================================================

function copyRef() {

    const code = "ABC123";


    if (
        navigator.clipboard &&
        window.isSecureContext
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
                    "Referral code: " +
                    code
                );

            });

    } else {

        alert(
            "Referral code: " +
            code
        );

    }
}



// ==================================================
// WITHDRAW
// ==================================================

function withdraw() {

    const user =
        JSON.parse(
            localStorage.getItem("earnhubUser") || "null"
        );


    if (!user) {

        alert("Please login first.");

        return;
    }


    const amount =
        Number(
            prompt(
                "Enter withdrawal amount (₹):"
            )
        );


    if (!amount || amount <= 0) {

        alert("Enter a valid amount.");

        return;
    }


    const balance =
        Number(user.balance || 0);


    if (amount > balance) {

        alert("Insufficient balance.");

        return;
    }


    const upi =
        prompt("Enter your UPI ID:");


    if (!upi || !upi.includes("@")) {

        alert("Please enter a valid UPI ID.");

        return;
    }


    user.balance =
        balance - amount;


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

            date:
                new Date().toLocaleString()

        })
    );


    alert(

        "Withdrawal request submitted successfully!\n\n" +

        "Amount: ₹" +
        amount +

        "\nUPI: " +
        upi +

        "\nStatus: Pending"

    );


    location.reload();
}



// ==================================================
// TASK DATA
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

        localStorage.getItem(
            "earnhubTasks"
        ) || "{}"

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


    const task =
        earnHubTasks.find(

            function (t) {

                return t.id ===
                    Number(taskId);

            }

        );


    if (!task) {

        alert("Task not found.");

        return;
    }


    const data =
        getTaskData();


    const current =
        data[taskId];


    if (
        current &&
        current.status === "Pending"
    ) {

        alert(
            "This task is already pending approval."
        );

        return;
    }


    if (
        current &&
        current.status === "Approved"
    ) {

        alert(
            "You have already completed this task."
        );

        return;
    }


    data[taskId] = {

        status: "Started",

        startedAt:
            new Date().toLocaleString(),

        reward:
            task.reward,

        title:
            task.title

    };


    saveTaskData(data);


    alert(

        task.title +

        "\n\nTask started!" +

        "\n\nComplete the task and then submit it."

    );


    renderTasks();
}



// ==================================================
// SUBMIT TASK
// ==================================================

function submitTask(taskId) {


    const task =
        earnHubTasks.find(

            function (t) {

                return t.id ===
                    Number(taskId);

            }

        );


    if (!task) {

        alert("Task not found.");

        return;
    }


    const data =
        getTaskData();


    if (
        !data[taskId] ||
        data[taskId].status !== "Started"
    ) {

        alert(
            "Please start the task first."
        );

        return;
    }


    data[taskId].status =
        "Pending";


    data[taskId].submittedAt =
        new Date().toLocaleString();


    data[taskId].reward =
        task.reward;


    data[taskId].title =
        task.title;


    saveTaskData(data);


    alert(

        "Task submitted successfully!\n\n" +

        "Reward: ₹" +
        task.reward +

        "\nStatus: Pending Approval"

    );


    renderTasks();
}



// ==================================================
// DISPLAY TASKS
// ==================================================

function renderTasks() {


    const container =
        document.getElementById(
            "taskList"
        );


    if (!container) return;


    const data =
        getTaskData();


    container.innerHTML = "";


    earnHubTasks.forEach(

        function (task) {


            const taskData =
                data[task.id];


            let button = "";


            let status = "";


            if (!taskData) {


                button = `

                    <button
                        onclick="startTask(${task.id})">

                        Start Task

                    </button>

                `;


            }

            else if (
                taskData.status ===
                "Started"
            ) {


                status = `

                    <div class="task-status started">
                        ▶ Task in progress
                    </div>

                `;


                button = `

                    <button
                        onclick="submitTask(${task.id})">

                        Submit Task

                    </button>

                `;


            }

            else if (
                taskData.status ===
                "Pending"
            ) {


                status = `

                    <div class="task-status pending">
                        ⏳ Waiting for approval
                    </div>

                `;


                button = `

                    <button disabled>

                        ⏳ Pending Approval

                    </button>

                `;


            }

            else if (
                taskData.status ===
                "Approved"
            ) {


                status = `

                    <div class="task-status approved">
                        ✓ Reward approved
                    </div>

                `;


                button = `

                    <button disabled>

                        ✓ Completed

                    </button>

                `;


            }

            else if (
                taskData.status ===
                "Rejected"
            ) {


                status = `

                    <div class="task-status rejected">
                        ✕ Submission rejected
                    </div>

                `;


                button = `

                    <button
                        onclick="startTask(${task.id})">

                        Try Again

                    </button>

                `;

            }


            container.innerHTML += `

                <article class="task-card">

                    <div class="task-card-top">

                        <div>

                            <h2>
                                ${task.title}
                            </h2>

                            <p>
                                ${task.description}
                            </p>

                        </div>

                        <div class="reward">
                            ₹${task.reward}
                        </div>

                    </div>

                    ${status}

                    <div class="task-button-area">

                        ${button}

                    </div>

                </article>

            `;

        }

    );


    updateTaskCount();

}



// ==================================================
// TASK COUNT
// ==================================================

function updateTaskCount() {


    const element =
        document.getElementById(
            "taskCount"
        );


    if (!element) return;


    const data =
        getTaskData();


    let available = 0;


    earnHubTasks.forEach(

        function (task) {

            const item =
                data[task.id];


            if (
                !item ||
                item.status === "Rejected"
            ) {

                available++;

            }

        }

    );


    element.textContent =
        available;

}



// ==================================================
// ADMIN PANEL
// ==================================================

function renderAdmin() {


    const container =
        document.getElementById(
            "adminSubmissions"
        );


    if (!container) return;


    const data =
        getTaskData();


    container.innerHTML = "";


    let pending = 0;

    let approved = 0;

    let rejected = 0;


    earnHubTasks.forEach(

        function (task) {


            const item =
                data[task.id];


            if (!item) return;


            if (item.status === "Pending") {

                pending++;

            }


            if (item.status === "Approved") {

                approved++;

            }


            if (item.status === "Rejected") {

                rejected++;

            }


            container.innerHTML += `

                <article class="admin-card">

                    <h3>
                        ${task.title}
                    </h3>

                    <p>
                        <strong>Reward:</strong>
                        ₹${task.reward}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${item.status}
                    </p>

                    ${
                        item.startedAt
                        ?
                        `<p>
                            <strong>Started:</strong>
                            ${item.startedAt}
                        </p>`
                        :
                        ""
                    }

                    ${
                        item.submittedAt
                        ?
                        `<p>
                            <strong>Submitted:</strong>
                            ${item.submittedAt}
                        </p>`
                        :
                        ""
                    }


                    ${
                        item.status === "Pending"

                        ?

                        `

                        <div class="admin-actions">

                            <button
                                class="approve-btn"
                                onclick="approveTask(${task.id})">

                                ✓ Approve ₹${task.reward}

                            </button>


                            <button
                                class="reject-btn"
                                onclick="rejectTask(${task.id})">

                                ✕ Reject

                            </button>

                        </div>

                        `

                        :

                        `

                        <span class="${
                            item.status === "Approved"
                            ?
                            "status-approved"
                            :
                            "status-rejected"
                        }">

                            ${
                                item.status === "Approved"
                                ?
                                "✓ Approved"
                                :
                                "✕ Rejected"
                            }

                        </span>

                        `

                    }

                </article>

            `;

        }

    );


    if (container.innerHTML === "") {

        container.innerHTML = `

            <div class="admin-empty">

                <h3>
                    No submissions yet
                </h3>

                <p>
                    Submitted tasks will appear here.
                </p>

            </div>

        `;

    }


    document.getElementById(
        "pendingCount"
    ).textContent = pending;


    document.getElementById(
        "approvedCount"
    ).textContent = approved;


    document.getElementById(
        "rejectedCount"
    ).textContent = rejected;

}



// ==================================================
// APPROVE TASK
// ==================================================

function approveTask(taskId) {


    const data =
        getTaskData();


    const task =
        earnHubTasks.find(

            function (t) {

                return t.id ===
                    Number(taskId);

            }

        );


    if (!task) return;


    if (
        !data[taskId] ||
        data[taskId].status !== "Pending"
    ) {

        alert(
            "This task is not pending."
        );

        return;
    }


    const user =
        JSON.parse(

            localStorage.getItem(
                "earnhubUser"
            ) || "null"

        );


    if (!user) {

        alert(
            "No user account found."
        );

        return;
    }


    user.balance =
        Number(user.balance || 0) +
        task.reward;


    user.taskEarnings =
        Number(user.taskEarnings || 0) +
        task.reward;


    data[taskId].status =
        "Approved";


    data[taskId].approvedAt =
        new Date().toLocaleString();


    saveTaskData(data);


    localStorage.setItem(

        "earnhubUser",

        JSON.stringify(user)

    );


    addActivity(

        "📝 " +
        task.title,

        "+₹" + task.reward

    );


    alert(

        "Task approved!\n\n" +

        "₹" +
        task.reward +
        " added to the user's balance."

    );


    renderAdmin();
}



// ==================================================
// REJECT TASK
// ==================================================

function rejectTask(taskId) {


    const data =
        getTaskData();


    if (
        !data[taskId] ||
        data[taskId].status !== "Pending"
    ) {

        alert(
            "This task is not pending."
        );

        return;
    }


    const reason =
        prompt(
            "Enter rejection reason:"
        );


    data[taskId].status =
        "Rejected";


    data[taskId].rejectedAt =
        new Date().toLocaleString();


    data[taskId].rejectionReason =
        reason ||
        "Submission did not meet the requirements.";


    saveTaskData(data);


    alert(
        "Task rejected."
    );


    renderAdmin();
}



// ==================================================
// ACTIVITY
// ==================================================

function getActivities() {

    return JSON.parse(

        localStorage.getItem(
            "earnhubActivities"
        ) || "[]"

    );

}


function saveActivities(activities) {

    localStorage.setItem(

        "earnhubActivities",

        JSON.stringify(activities)

    );

}


function addActivity(title, amount) {


    const activities =
        getActivities();


    activities.unshift({

        title: title,

        amount: amount,

        date:
            new Date().toLocaleString()

    });


    if (activities.length > 10) {

        activities.length = 10;

    }


    saveActivities(activities);

}



// ==================================================
// DISPLAY DASHBOARD DATA
// ==================================================

function loadDashboard() {


    const user =
        JSON.parse(

            localStorage.getItem(
                "earnhubUser"
            ) || "null"

        );


    if (!user) return;


    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            user.name + " 👋";

    }


    const balance =
        document.getElementById(
            "balance"
        );


    if (balance) {

        balance.textContent =
            Number(
                user.balance || 0
            ).toFixed(0);

    }


    const taskEarnings =
        document.getElementById(
            "taskEarnings"
        );


    if (taskEarnings) {

        taskEarnings.textContent =
            "₹" +
            Number(
                user.taskEarnings || 0
            ).toFixed(0);

    }


    const avatar =
        document.getElementById(
            "avatar"
        );


    if (avatar) {

        avatar.textContent =
            user.name
                .charAt(0)
                .toUpperCase();

    }


    renderActivities();

}



// ==================================================
// RENDER ACTIVITIES
// ==================================================

function renderActivities() {


    const container =
        document.getElementById(
            "activityList"
        );


    if (!container) return;


    const activities =
        getActivities();


    if (activities.length === 0) return;


    container.innerHTML = "";


    activities.forEach(

        function (item) {

            container.innerHTML += `

                <div class="activity-row">

                    <span>
                        ${item.title}
                    </span>

                    <b>
                        ${item.amount}
                    </b>

                </div>

            `;

        }

    );

}



// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(

    "DOMContentLoaded",

    function () {


        loadDashboard();


        renderTasks();


        renderAdmin();


    }

);
