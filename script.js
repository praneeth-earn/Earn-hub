/* ==================================================
   EARNHUB - MAIN JAVASCRIPT
   COMPLETE VERSION
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
    },

    {
        id: 4,
        title: "🌐 Visit a website",
        reward: 8,
        description:
            "Visit the assigned website and complete the required activity."
    },

    {
        id: 5,
        title: "⭐ Rate an experience",
        reward: 12,
        description:
            "Complete the required rating or feedback activity."
    }

];


/* ==================================================
   USER STORAGE
   ================================================== */

function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem("earnhubUser") || "null"
        );

    } catch (error) {

        return null;

    }

}


function saveUser(user) {

    localStorage.setItem(
        "earnhubUser",
        JSON.stringify(user)
    );

}


/* ==================================================
   CREATE USER DEFAULT DATA
   ================================================== */

function createUser(name, email, password) {

    return {

        name: name,

        email: email,

        password: password,

        balance: 250,

        taskEarnings: 0,

        referralEarnings: 0,

        adEarnings: 0,

        referralCode:
            "EH" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase(),

        createdAt:
            new Date().toLocaleString()

    };

}


/* ==================================================
   SIGN UP
   ================================================== */

function signup(event) {

    if (event) {

        event.preventDefault();

    }


    const nameElement =
        document.getElementById("name");

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");


    if (
        !nameElement ||
        !emailElement ||
        !passwordElement
    ) {

        alert(
            "Signup form fields were not found."
        );

        return false;

    }


    const name =
        nameElement.value.trim();

    const email =
        emailElement.value
            .trim()
            .toLowerCase();

    const password =
        passwordElement.value;


    if (!name) {

        alert(
            "Please enter your name."
        );

        return false;

    }


    if (!email) {

        alert(
            "Please enter your email."
        );

        return false;

    }


    if (!email.includes("@")) {

        alert(
            "Please enter a valid email address."
        );

        return false;

    }


    if (!password) {

        alert(
            "Please enter a password."
        );

        return false;

    }


    if (password.length < 4) {

        alert(
            "Password must contain at least 4 characters."
        );

        return false;

    }


    const existingUser =
        getUser();


    if (
        existingUser &&
        existingUser.email === email
    ) {

        alert(
            "An account with this email already exists. Please login."
        );

        window.location.href =
            "login.html";

        return false;

    }


    const user =
        createUser(
            name,
            email,
            password
        );


    saveUser(user);


    localStorage.setItem(
        "earnhubLoggedIn",
        "true"
    );


    addActivity({

        type: "account",

        title:
            "Account created successfully",

        amount: 0,

        date:
            new Date().toLocaleString()

    });


    alert(
        "Account created successfully!"
    );


    window.location.href =
        "dashboard.html";


    return false;

}


/* ==================================================
   LOGIN
   ================================================== */

function login(event) {

    if (event) {

        event.preventDefault();

    }


    const emailElement =
        document.getElementById("loginEmail");

    const passwordElement =
        document.getElementById("loginPassword");


    if (!emailElement) {

        alert(
            "Login email field was not found."
        );

        return false;

    }


    const email =
        emailElement.value
            .trim()
            .toLowerCase();


    const password =
        passwordElement
            ? passwordElement.value
            : "";


    if (!email) {

        alert(
            "Please enter your email."
        );

        return false;

    }


    if (!email.includes("@")) {

        alert(
            "Please enter a valid email address."
        );

        return false;

    }


    const user =
        getUser();


    if (!user) {

        alert(
            "No account found. Please create an account first."
        );

        window.location.href =
            "signup.html";

        return false;

    }


    if (
        user.email.toLowerCase() !==
        email
    ) {

        alert(
            "This email does not match the registered account."
        );

        return false;

    }


    /*
       Support old accounts that were
       created before passwords were added.
    */

    if (
        user.password &&
        password !== user.password
    ) {

        alert(
            "Incorrect password."
        );

        return false;

    }


    /*
       If user has a password,
       password field must not be empty.
    */

    if (
        user.password &&
        !password
    ) {

        alert(
            "Please enter your password."
        );

        return false;

    }


    localStorage.setItem(
        "earnhubLoggedIn",
        "true"
    );


    window.location.href =
        "dashboard.html";


    return false;

}


/* ==================================================
   LOGOUT
   ================================================== */

function logout() {

    localStorage.removeItem(
        "earnhubLoggedIn"
    );


    window.location.href =
        "index.html";

}


/* ==================================================
   CHECK LOGIN
   ================================================== */

function checkLogin() {

    const loggedIn =
        localStorage.getItem(
            "earnhubLoggedIn"
        );

    const user =
        getUser();


    if (
        loggedIn !== "true" ||
        !user
    ) {

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


/* ==================================================
   UPDATE DASHBOARD USER
   ================================================== */

function renderDashboard() {

    const user =
        getUser();


    if (!user) {

        return;

    }


    const userName =
        document.getElementById(
            "userName"
        );


    const balanceElement =
        document.getElementById(
            "balance"
        );


    const avatar =
        document.querySelector(
            ".avatar"
        );


    if (userName) {

        userName.textContent =
            user.name + " 👋";

    }


    if (balanceElement) {

        balanceElement.textContent =
            Number(
                user.balance || 0
            ).toLocaleString("en-IN");

    }


    if (avatar) {

        avatar.textContent =
            user.name
                .charAt(0)
                .toUpperCase();

    }


    updateDashboardStats();

}


/* ==================================================
   UPDATE DASHBOARD STATS
   ================================================== */

function updateDashboardStats() {

    const user =
        getUser();


    if (!user) {

        return;

    }


    const stats =
        document.querySelectorAll(
            ".stat b"
        );


    if (stats.length >= 4) {

        const activities =
            getActivities();


        const today =
            new Date()
                .toLocaleDateString();


        let todayEarnings = 0;


        activities.forEach(
            function(activity) {

                if (
                    activity.amount > 0 &&
                    activity.date
                ) {

                    const activityDate =
                        new Date(
                            activity.date
                        ).toLocaleDateString();


                    if (
                        activityDate ===
                        today
                    ) {

                        todayEarnings +=
                            Number(
                                activity.amount || 0
                            );

                    }

                }

            }
        );


        stats[0].textContent =
            "₹" + todayEarnings;

        stats[1].textContent =
            "₹" +
            Number(
                user.taskEarnings || 0
            );

        stats[2].textContent =
            "₹" +
            Number(
                user.referralEarnings || 0
            );

        stats[3].textContent =
            "₹" +
            Number(
                user.adEarnings || 0
            );

    }

}


/* ==================================================
   REFERRAL
   ================================================== */

function copyRef() {

    const user =
        getUser();


    if (!user) {

        alert(
            "Please login first."
        );

        return;

    }


    const code =
        user.referralCode ||
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


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Enter a valid withdrawal amount."
        );

        return;

    }


    const balance =
        Number(
            user.balance || 0
        );


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


    renderDashboard();

    renderActivity();

}


/* ==================================================
   TASK STORAGE
   ================================================== */

function getTaskData() {

    try {

        return JSON.parse(

            localStorage.getItem(
                "earnhubTasks"
            ) || "{}"

        );

    } catch (error) {

        return {};

    }

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
            function(t) {

                return (
                    t.id ===
                    Number(taskId)
                );

            }
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
            function(t) {

                return (
                    t.id ===
                    Number(taskId)
                );

            }
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
            function(t) {

                return (
                    t.id ===
                    Number(taskId)
                );

            }
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
            Number(
                user.balance || 0
            ) +
            task.reward;


        user.taskEarnings =
            Number(
                user.taskEarnings || 0
            ) +
            task.reward;


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

        "Task approved!\n\n₹" +
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
