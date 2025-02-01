const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const role = document.getElementById("role");
const address = document.getElementById("address");
const submit = document.getElementById("submit");
const tbody = document.getElementById("tbody");
const btnDelete = document.getElementById("btnDelete");
let pageMode = localStorage.getItem("mode") || "dark";
let searchMood = "name";
let mode = "create";
let tmp;

const actionHistory = localStorage.getItem("actionHistory") 
  ? JSON.parse(localStorage.getItem("actionHistory")) 
  : [];

let dataUsers = localStorage.getItem("users") 
  ? JSON.parse(localStorage.getItem("users")) 
  : [];

function logAction(action, user, index = null) {
  const actionEntry = {
    action,
    user: { name: user.name, email: user.email, role: user.role },
    index,
    timestamp: new Date().toLocaleString(),
  };
  actionHistory.push(actionEntry);
  localStorage.setItem("actionHistory", JSON.stringify(actionHistory));
}

function clearForm() {
  name.value = "";
  email.value = "";
  phone.value = "";
  role.value = "";
  address.value = "";
}
function showData() {
  const table = dataUsers.map((user, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.role}</td>
      <td>${user.address}</td>
      <td><button onclick="updateUser(${i})" id="update">Update</button></td>
      <td><button onclick="deleteUser(${i})" id="delete">Delete</button></td>
    </tr>`
  ).join("");
  tbody.innerHTML = table;
  btnDelete.style.display = dataUsers.length > 0 ? "block" : "none";
}

function deleteUser(i) {
  const deletedUser = dataUsers[i];
  dataUsers.splice(i, 1);
  logAction("delete", deletedUser, i);
  localStorage.setItem("users", JSON.stringify(dataUsers));
  showData();
}

function deleteAllItems() {
  dataUsers.forEach((user, index) => logAction("delete", user, index));
  localStorage.removeItem("users");
  dataUsers = [];
  showData();
}

function updateUser(i) {
  const user = dataUsers[i];
  name.value = user.name;
  email.value = user.email;
  phone.value = user.phone;
  role.value = user.role;
  address.value = user.address;
  submit.innerHTML = "Update";
  mode = "update";
  tmp = i;
}

function getSearchMood(id) {
  searchMood = id === "searchName" ? "name" : "role";
  document.getElementById("search").placeholder = `Search By ${searchMood.charAt(0).toUpperCase() + searchMood.slice(1)}`;
}

function searchData(value) {
  const filteredUsers = dataUsers.filter(user => 
    user[searchMood].toLowerCase().includes(value.toLowerCase())
  );
  const table = filteredUsers.map((user, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.role}</td>
      <td>${user.address}</td>
      <td><button onclick="updateUser(${i})" id="update">Update</button></td>
      <td><button onclick="deleteUser(${i})" id="delete">Delete</button></td>
    </tr>`
  ).join("");
  tbody.innerHTML = table;
}

function setMode(mode) {
  const inputs = document.getElementsByTagName("input");
  const buttons = document.getElementsByTagName("button");
  const smalls = document.getElementsByTagName("small");
  const lightDarkMode = document.getElementById("lightDarkModeBtn");

  if (mode === "light") {
    document.body.classList.add("body");
    applyClassOnElements(inputs, "input", "add");
    applyClassOnElements(buttons, "button", "add");
    applyClassOnElements(smalls, "small", "add");
    lightDarkMode.innerHTML = `<i id="sun" class="material-icons">sunny</i>`;
  } else {
    document.body.classList.remove("body");
    applyClassOnElements(inputs, "input", "remove");
    applyClassOnElements(buttons, "button", "remove");
    applyClassOnElements(smalls, "small", "remove");
    lightDarkMode.innerHTML = `<i id="moon" class="fa fa-moon-o"></i>`;
  }
}

function applyClassOnElements(elements, className, action) {
  Array.from(elements).forEach(element => 
    element.classList[action === "add" ? "add" : "remove"](className)
  );
}

function lightMode() {
  pageMode = pageMode === "dark" ? "light" : "dark";
  setMode(pageMode);
  localStorage.setItem("mode", pageMode);
}
submit.onclick = () => {
  if (name.value && email.value && phone.value && role.value && address.value) {
    const newUser = { name: name.value, email: email.value, phone: phone.value, role: role.value, address: address.value };

    if (mode === "create") {
      dataUsers.push(newUser);
      logAction("create", newUser);
    } else {
      dataUsers[tmp] = newUser;
      logAction("update", newUser, tmp);
      mode = "create";
      submit.innerHTML = "Create";
    }
    localStorage.setItem("users", JSON.stringify(dataUsers));
    clearForm();
    showData();
  }};

setMode(pageMode);
showData();