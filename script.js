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
   SIGN UP
   ================================================== */

function signup(e) {

    if (e) {
        e.preventDefault();
    }


    const nameElement =
        document.getElementById("name");

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");


    if (!nameElement || !emailElement) {

        alert("Signup form could not be found.");

        return false;

    }


    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim().toLowerCase();

    const password =
        passwordElement
            ? passwordElement.value
            : "";


    if (!name) {

        alert("Please enter your name.");

        return false;

    }


    if (!email) {

        alert("Please enter your email.");

        return false;

    }


    if (!email.includes("@")) {

        alert("Please enter a valid email address.");

        return false;

    }


    if (
        passwordElement &&
        password.length < 6
    ) {

        alert(
            "Password must be at least 6 characters."
        );

        return false;

    }


    const user = {

        name: name,

        email: email,

        password: password,

        balance: 250,

        taskEarnings: 0,

        referralEarnings: 0,

        adEarnings: 0,

        referralCode:
            generateReferralCode(),

        createdAt:
            new Date().toLocaleString()

    };


    saveUser(user);


    alert(
        "Account created successfully!"
    );


    window.location.href =
        "dashboard.html";


    return false;

}


/* ==================================================
   GENERATE REFERRAL CODE
   ================================================== */

function generateReferralCode() {

    return "EH" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

}


/* ==================================================
   LOGIN
   ================================================== */

function login(e) {

    if (e) {
        e.preventDefault();
    }


    const emailElement =
        document.getElementById("loginEmail");


    const passwordElement =
        document.getElementById("loginPassword") ||
        document.getElementById("password");


    if (!emailElement) {

        alert(
            "Login form could not be found."
        );

        return false;

    }


    const email =
        emailElement.value.trim().toLowerCase();


    const password =
        passwordElement
            ? passwordElement.value
            : "";


    /* ----------------------------------------------
       CHECK EMAIL
       ---------------------------------------------- */

    if (!email) {

        alert(
            "Please enter your email."
        );

        emailElement.focus();

        return false;

    }


    if (!email.includes("@")) {

        alert(
            "Please enter a valid email address."
        );

        emailElement.focus();

        return false;

    }


    /* ----------------------------------------------
       GET SAVED USER
       ---------------------------------------------- */

    let user =
        getUser();


    /* ----------------------------------------------
       NO ACCOUNT YET
       ---------------------------------------------- */

    if (!user) {

        alert(
            "No account found.\n\n" +
            "Please create an account first."
        );

        window.location.href =
            "signup.html";

        return false;

    }


    /* ----------------------------------------------
       CHECK EMAIL
       ---------------------------------------------- */

    if (
        user.email &&
        user.email.toLowerCase() !== email
    ) {

        alert(
            "Email does not match the registered account."
        );

        return false;

    }


    /* ----------------------------------------------
       CHECK PASSWORD
       ---------------------------------------------- */

    if (user.password) {

        if (!password) {

            alert(
                "Please enter your password."
            );

            if (passwordElement) {
                passwordElement.focus();
            }

            return false;

        }


        if (user.password !== password) {

            alert(
                "Incorrect password."
            );

            if (passwordElement) {
                passwordElement.focus();
            }

            return false;

        }

    }


    /* ----------------------------------------------
       MAKE SURE OLD ACCOUNTS HAVE ALL FIELDS
       ---------------------------------------------- */

    user.name =
        user.name ||
        email.split("@")[0];

    user.email =
        user.email ||
        email;

    user.balance =
        Number(user.balance || 0);

    user.taskEarnings =
        Number(user.taskEarnings || 0);

    user.referralEarnings =
        Number(user.referralEarnings || 0);

    user.adEarnings =
        Number(user.adEarnings || 0);

    user.referralCode =
        user.referralCode ||
        generateReferralCode();


    saveUser(user);


    /* ----------------------------------------------
       LOGIN SUCCESS
       ---------------------------------------------- */

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
   REFERRAL CODE
   ================================================== */

function getReferralCode() {

    const user =
        getUser();


    if (
        user &&
        user.referralCode
    ) {

        return user.referralCode;

    }


    return "ABC123";

}


function copyRef() {

    const code =
        getReferralCode();


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(code)
            .then(function () {

                alert(
                    "Referral code copied:\n\n" +
                    code
                );

            })
            .catch(function () {

                alert(
                    "Your referral code is:\n\n" +
                    code
                );

            });

    } else {

        alert(
            "Your referral code is:\n\n" +
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

        window.location.href =
            "login.html";

        return;

    }


    const amountInput =
        prompt(
            "Enter withdrawal amount (₹):"
        );


    if (
        amountInput === null
    ) {

        return;

    }


    const amount =
        Number(amountInput);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Enter a valid amount."
        );

        return;

    }


    const balance =
        Number(user.balance || 0);


    if (amount > balance)
