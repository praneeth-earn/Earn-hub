// ==================================================
// EARNHUB - MAIN SCRIPT
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

    const email =
        document.getElementById("loginEmail").value.trim();

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
        navigator.clipboard.writeText(code);
    }

    alert(
        "Referral code copied: " + code
    );
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
// TASK LIST
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
// TASK DATA
// ==================================================

function getTaskData() {

    return JSON.parse(
        localStorage.getItem("earnhubTasks") || "{}"
    );
}


function saveTaskData(data) {

    localStorage.setItem(
        "earnhubTasks",
        JSON.stringify(data)
    );
}



// ==================================================
// SUBMISSIONS
// ==================================================

function getSubmissions() {

    return JSON.parse(
        localStorage.getItem(
            "earnhubSubmissions"
        ) || "[]"
    );
}


function saveSubmissions(submissions) {

    localStorage.setItem(
        "earnhubSubmissions",
        JSON.stringify(submissions)
    );
}



// ==================================================
// START TASK
// ==================================================

function startTask(taskId) {

    const task =
        earnHubTasks.find(
            t => t.id === Number(taskId)
        );

    if (!task) {

        alert("Task not found.");

        return;
    }

    const data =
        getTaskData();

    const existing =
        data[taskId];

    if (
        existing &&
        (
            existing.status === "Pending" ||
            existing.status === "Completed"
        )
    ) {

        alert(
            "You have already submitted this task."
        );

        return;
    }

    data[taskId] = {

        status: "Started",

        startedAt:
            new Date().toLocaleString(),

        reward:
            task.reward
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

    const task =
        earnHubTasks.find(
            t => t.id === Number(taskId)
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


    // Get current user

    const user = JSON.parse(
        localStorage.getItem(
            "earnhubUser"
        ) || "null"
    );


    if (!user) {

        alert(
            "Please login first."
        );

        return;
    }


    // Change task status

    data[taskId].status =
        "Pending";

    data[taskId].submittedAt =
        new Date().toLocaleString();

    saveTaskData(data);


    // Create admin submission

    const submissions =
        getSubmissions();


    const submission = {

        id:
            Date.now(),

        taskId:
            task.id,

        taskTitle:
            task.title,

        reward:
            task.reward,

        userName:
            user.name,

        userEmail:
            user.email,

        status:
            "Pending",

        submittedAt:
            new Date().toLocaleString()
    };


    submissions.push(
        submission
    );

    saveSubmissions(
        submissions
    );


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
        task => {

            const taskData =
                data[task.id];


            let button = "";


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

                button = `
                    <button disabled>

                        ⏳ Pending Approval

                    </button>
                `;

            }


            else {

                button = `
                    <button disabled>

                        ✓ Completed

                    </button>
                `;

            }


            container.innerHTML += `

                <div class="task-card">

                    <h2>
                        ${task.title}
                    </h2>

                    <p>
                        ${task.description}
                    </p>

                    <strong>
                        Reward: ₹${task.reward}
                    </strong>

                    ${button}

                </div>

            `;
        }
    );
}



// ==================================================
// UPDATE DASHBOARD BALANCE
// ==================================================

function updateDashboard() {

    const balanceElement =
        document.getElementById(
            "balance"
        );

    if (!balanceElement)
        return;


    const user = JSON.parse(
        localStorage.getItem(
            "earnhubUser"
        ) || "null"
    );


    if (user) {

        balanceElement.textContent =
            Number(
                user.balance || 0
            ).toFixed(0);
    }
}



// ==================================================
// UPDATE USER NAME
// ==================================================

function updateUserName() {

    const userName =
        document.getElementById(
            "userName"
        );

    if (!userName)
        return;


    const user = JSON.parse(
        localStorage.getItem(
            "earnhubUser"
        ) || "null"
    );


    if (user) {

        userName.textContent =
            user.name + " 👋";
    }
}



// ==================================================
// ADMIN - GET SUBMISSIONS
// ==================================================

function renderAdminSubmissions() {

    const container =
        document.getElementById(
            "adminSubmissions"
        );

    if (!container)
        return;


    const submissions =
        getSubmissions();


    container.innerHTML = "";


    if (submissions.length === 0) {

        container.innerHTML = `

            <div class="admin-empty">

                <h3>
                    No task submissions
                </h3>

                <p>
                    Submitted tasks will appear here.
                </p>

            </div>

        `;

        return;
    }


   
