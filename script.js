const tasks=[
 {id:1,name:"Install an App",reward:10},
 {id:2,name:"Watch a Video",reward:5},
 {id:3,name:"Complete a Survey",reward:15}
];

function user(){
 return JSON.parse(localStorage.getItem("user"))||null;
}

function save(u){
 localStorage.setItem("user",JSON.stringify(u));
}

function signup(e){
 e.preventDefault();
 let u={
  name:document.getElementById("name").value,
  email:document.getElementById("email").value,
  balance:250,
  taskEarnings:0
 };
 save(u);
 location.href="dashboard.html";
}

function login(e){
 e.preventDefault();
 let email=document.getElementById("loginEmail").value;
 let u=user();

 if(!u||u.email!==email){
  u={name:"User",email:email,balance:250,taskEarnings:0};
  save(u);
 }

 location.href="dashboard.html";
}

function logout(){
 localStorage.removeItem("user");
 location.href="index.html";
}

function startTask(id){
 let data=JSON.parse(localStorage.getItem("tasks")||"{}");
 data[id]="started";
 localStorage.setItem("tasks",JSON.stringify(data));
 renderTasks();
}

function submitTask(id){
 let data=JSON.parse(localStorage.getItem("tasks")||"{}");
 data[id]="pending";
 localStorage.setItem("tasks",JSON.stringify(data));
 alert("Task submitted for approval.");
 renderTasks();
}

function renderTasks(){
 let box=document.getElementById("taskList");
 if(!box)return;

 let data=JSON.parse(localStorage.getItem("tasks")||"{}");

 box.innerHTML=tasks.map(t=>{
  let s=data[t.id]||"new";
  let button="";

  if(s==="new")
   button=`<button onclick="startTask(${t.id})">Start Task</button>`;

  if(s==="started")
   button=`<button onclick="submitTask(${t.id})">Submit Task</button>`;

  if(s==="pending")
   button="<button disabled>Pending</button>";

  if(s==="approved")
   button="<button disabled>Approved ✓</button>";

  if(s==="rejected")
   button=`<button onclick="startTask(${t.id})">Try Again</button>`;

  return `
   <div class="task-card">
    <h3>${t.name}</h3>
    <p>Reward: ₹${t.reward}</p>
    ${button}
   </div>`;
 }).join("");
}

function approveTask(id){
 let data=JSON.parse(localStorage.getItem("tasks")||"{}");
 let t=tasks.find(x=>x.id==id);
 let u=user();

 if(!t||!u)return;

 data[id]="approved";
 u.balance=(u.balance||0)+t.reward;
 u.taskEarnings=(u.taskEarnings||0)+t.reward;

 save(u);
 localStorage.setItem("tasks",JSON.stringify(data));
 renderAdmin();
}

function rejectTask(id){
 let data=JSON.parse(localStorage.getItem("tasks")||"{}");
 data[id]="rejected";
 localStorage.setItem("tasks",JSON.stringify(data));
 renderAdmin();
}

function renderAdmin(){
 let box=document.getElementById("adminSubmissions");
 if(!box)return;

 let data=JSON.parse(localStorage.getItem("tasks")||"{}");

 box.innerHTML=tasks.map(t=>{
  let s=data[t.id]||"new";

  if(s!=="pending")return "";

  return `
   <div class="task-card">
    <h3>${t.name}</h3>
    <p>Reward: ₹${t.reward}</p>
    <button onclick="approveTask(${t.id})">Approve</button>
    <button onclick="rejectTask(${t.id})">Reject</button>
   </div>`;
 }).join("")||"<p>No pending submissions.</p>";
}

function loadDashboard(){
 let u=user();
 let name=document.getElementById("userName");
 let balance=document.getElementById("balance");

 if(u&&name)name.textContent=u.name+" 👋";
 if(u&&balance)balance.textContent=u.balance;
}

document.addEventListener("DOMContentLoaded",()=>{
 loadDashboard();
 renderTasks();
 renderAdmin();
});
