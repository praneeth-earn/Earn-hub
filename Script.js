function signup(e){
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const email=document.getElementById("email").value.trim();

  localStorage.setItem(
    "earnhubUser",
    JSON.stringify({name:name,email:email,balance:250})
  );

  alert("Account created successfully!");
  window.location.href="dashboard.html";
}

function login(e){
  e.preventDefault();

  const email=document.getElementById("loginEmail").value.trim();

  let user=JSON.parse(
    localStorage.getItem("earnhubUser") || "null"
  );

  if(!user){
    user={
      name:email.split("@")[0],
      email:email,
      balance:250
    };

    localStorage.setItem(
      "earnhubUser",
      JSON.stringify(user)
    );
  }

  window.location.href="dashboard.html";
}

function logout(){
  window.location.href="index.html";
}

function copyRef(){
  const code="ABC123";

  if(navigator.clipboard){
    navigator.clipboard.writeText(code);
  }

  alert("Referral code copied: "+code);
}

document.addEventListener("DOMContentLoaded",function(){
  const userName=document.getElementById("userName");

  if(userName){
    const user=JSON.parse(
      localStorage.getItem("earnhubUser") || "null"
    );

    if(user){
      userName.textContent=user.name+" 👋";
    }
  }
});
