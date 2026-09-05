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

/* SIGNUP */
function signup(e){
 e.preventDefault();

 const name=document.getElementById("name").value;
 const email=document.getElementById("email").value;

 save({
  name:name,
  email:email,
  balance:250,
  taskEarnings:0
 });

 location.href="dashboard.html";
}

/* LOGIN */
function login(e){
 e.preventDefault();

 const email=document.getElementById("loginEmail").value.trim();
 let u=user();

 if(!u || u.email!==email){
  u={
   name:"User",
   email:email,
   balance:250,
   taskEarnings:0
  };
  save(u);
 }

 location.href="dashboard.html";
}

/* LOGOUT */
function logout(){
 localStorage.removeItem("user");
 location.href="index.html";
}

/* DASHBOARD */
function loadDashboard(){
 const u=user();
 const name=document.getElementById("userName");
 const balance=document.getElementById("balance");

 if(u&&name)name.textContent=u.name+" 👋";
 if(u&&balance)balance.textContent=u.balance;
}

/* TASKS */
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
 const box=document.getElementById("taskList");
 if(!box)return;

 const data=JSON.parse(localStorage.getItem("tasks")||"{}");

 box.innerHTML=tasks.map(t=>{
  const s=data[t.id]||"new";

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
   </div>
  `;
 }).join("");
}

/* ADMIN TASKS */
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
 const box=document.getElementById("adminSubmissions");
 if(!box)return;

 const data=JSON.parse(localStorage.getItem("tasks")||"{}");

 box.innerHTML=tasks.map(t=>{
  if(data[t.id]!=="pending")return "";

  return `
   <div class="task-card">
    <h3>${t.name}</h3>
    <p>Reward: ₹${t.reward}</p>
    <button onclick="approveTask(${t.id})">Approve</button>
    <button onclick="rejectTask(${t.id})">Reject</button>
   </div>
  `;
 }).join("")||"<p>No pending submissions.</p>";
}

/* WITHDRAW */
function withdraw(e){
 e.preventDefault();

 const u=user();
 const amount=Number(document.getElementById("amount").value);
 const upi=document.getElementById("upi").value.trim();

 if(!u)return alert("Please login first.");
 if(amount<=0)return alert("Enter a valid amount.");
 if(amount>u.balance)return alert("Insufficient balance.");
 if(!upi.includes("@"))return alert("Enter a valid UPI ID.");

 let requests=JSON.parse(localStorage.getItem("withdrawals")||"[]");

 requests.push({
  id:Date.now(),
  email:u.email,
  amount:amount,
  upi:upi,
  status:"pending"
 });

 u.balance-=amount;
 save(u);

 localStorage.setItem("withdrawals",JSON.stringify(requests));

 alert("Withdrawal request submitted.");
 location.reload();
}

/* ADMIN WITHDRAWALS */
function renderWithdrawals(){
 const box=document.getElementById("withdrawals");
 if(!box)return;

 const requests=JSON.parse(localStorage.getItem("withdrawals")||"[]");

 box.innerHTML=requests.map(r=>`
  <div class="task-card">
   <p>Email: ${r.email}</p>
   <p>Amount: ₹${r.amount}</p>
   <p>UPI: ${r.upi}</p>
   <b>${r.status}</b>

   ${r.status==="pending"?`
    <button onclick="approveWithdrawal(${r.id})">Approve</button>
    <button onclick="rejectWithdrawal(${r.id})">Reject</button>
   `:""}
  </div>
 `).join("")||"<p>No withdrawal requests.</p>";
}

function approveWithdrawal(id){
 let requests=JSON.parse(localStorage.getItem("withdrawals")||"[]");
 let r=requests.find(x=>x.id===id);

 if(r)r.status="approved";

 localStorage.setItem("withdrawals",JSON.stringify(requests));
 renderWithdrawals();
}

function rejectWithdrawal(id){
 let requests=JSON.parse(localStorage.getItem("withdrawals")||"[]");
 let r=requests.find(x=>x.id===id);

 if(r){
  r.status="rejected";

  let u=user();

  if(u&&u.email===r.email){
   u.balance+=r.amount;
   save(u);
  }
 }

 localStorage.setItem("withdrawals",JSON.stringify(requests));
 renderWithdrawals();
}

/* START */
document.addEventListener("DOMContentLoaded",()=>{
 loadDashboard();
 renderTasks();
 renderAdmin();
 renderWithdrawals();
});
