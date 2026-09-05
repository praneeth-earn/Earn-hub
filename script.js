function getUser(){
  return JSON.parse(localStorage.getItem("user")||"null");
}

function saveUser(u){
  localStorage.setItem("user",JSON.stringify(u));
}

function signup(e){
  e.preventDefault();

  saveUser({
    name:name.value,
    email:email.value,
    balance:250
  });

  location="dashboard.html";
}

function login(e){
  e.preventDefault();

  let u=getUser();
  let em=loginEmail.value.trim();

  if(!u||u.email!==em){
    u={name:"User",email:em,balance:250};
    saveUser(u);
  }

  location="dashboard.html";
}

function logout(){
  localStorage.removeItem("user");
  location="login.html";
}

function loadDashboard(){
  let u=getUser();

  if(userName)userName.textContent=u?.name+" 👋";
  if(balance)balance.textContent=u?.balance||0;
}

document.addEventListener("DOMContentLoaded",loadDashboard);
