function withdraw(e){
  e.preventDefault();

  let u=user();
  let amount=Number(document.getElementById("amount").value);
  let upi=document.getElementById("upi").value.trim();

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

  document.getElementById("withdrawStatus").textContent=
    "Withdrawal request submitted.";

  document.getElementById("amount").value="";
  document.getElementById("upi").value="";
  loadDashboard();
}

function renderWithdrawals(){
  let box=document.getElementById("withdrawals");
  if(!box)return;

  let requests=JSON.parse(localStorage.getItem("withdrawals")||"[]");

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
  let r=JSON.parse(localStorage.getItem("withdrawals")||"[]");
  let x=r.find(a=>a.id===id);

  if(x)x.status="approved";

  localStorage.setItem("withdrawals",JSON.stringify(r));
  renderWithdrawals();
}

function rejectWithdrawal(id){
  let r=JSON.parse(localStorage.getItem("withdrawals")||"[]");
  let x=r.find(a=>a.id===id);

  if(x){
    x.status="rejected";

    let u=user();
    if(u && u.email===x.email){
      u.balance+=x.amount;
      save(u);
    }
  }

  localStorage.setItem("withdrawals",JSON.stringify(r));
  renderWithdrawals();
}

document.addEventListener("DOMContentLoaded",()=>{
  loadDashboard();
  renderTasks();
  renderAdmin();
  renderWithdrawals();

  let b=document.getElementById("balance");
  let u=user();
  if(b&&u)b.textContent=u.balance;
});
