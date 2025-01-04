let name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let role = document.getElementById("role");
let address = document.getElementById("address");
let submit = document.getElementById("submit");
let tbody = document.getElementById("tbody");
let btnDelete = document.getElementById("btnDelete");
let pageMode = localStorage.getItem("mode") || "dark";
let lightDarkModeContent = localStorage.getItem("lightDarkModeContent");
let searchMood = "name";
let mode = "create";
let tmp;

function clearForm() {
  name.value = "";
  email.value = "";
  phone.value = "";
  role.value = "";
  address.value = "";
}

let dataUsers = localStorage.users ? JSON.parse(localStorage.users) : [];
showData();

submit.onclick = function () {
  if (name.value && email.value && phone.value && role.value && address.value) {
    let newUser = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      role: role.value,
      address: address.value,
    };

    if (mode === "create") {
      dataUsers.push(newUser);
    } else {
      dataUsers[tmp] = newUser;
      mode = "create";
      submit.innerHTML = "Create";
    }

    localStorage.setItem("users", JSON.stringify(dataUsers));
    clearForm();
    showData();
  }
};

function showData() {
  let table = "";
  for (let i = 0; i < dataUsers.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataUsers[i].name}</td>
        <td>${dataUsers[i].email}</td>
        <td>${dataUsers[i].phone}</td>
        <td>${dataUsers[i].role}</td>
        <td>${dataUsers[i].address}</td>
        <td><button onclick="updateUser(${i})" id="update">Update</button></td>
        <td><button onclick="deleteUser(${i})" id="delete">Delete</button></td>
      </tr>`;
  }
  tbody.innerHTML = table;
  btnDelete.style.display = dataUsers.length > 0 ? "block" : "none";
}

function deleteUser(i) {
  dataUsers.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(dataUsers));
  showData();
}

function deleteAllItems() {
  localStorage.removeItem("users");
  dataUsers = [];
  showData();
}

function updateUser(i) {
  name.value = dataUsers[i].name;
  email.value = dataUsers[i].email;
  phone.value = dataUsers[i].phone;
  role.value = dataUsers[i].role;
  address.value = dataUsers[i].address;
  submit.innerHTML = "Update";
  mode = "update";
  tmp = i;
}

function getSearchMood(id) {
  searchMood = id === "searchName" ? "name" : "role";
  document.getElementById("search").placeholder = `Search By ${searchMood.charAt(0).toUpperCase() + searchMood.slice(1)}`;
}

function searchData(value) {
  let table = "";
  for (let i = 0; i < dataUsers.length; i++) {
    if (dataUsers[i][searchMood].toLowerCase().includes(value.toLowerCase())) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataUsers[i].name}</td>
          <td>${dataUsers[i].email}</td>
          <td>${dataUsers[i].phone}</td>
          <td>${dataUsers[i].role}</td>
          <td>${dataUsers[i].address}</td>
          <td><button onclick="updateUser(${i})" id="update">Update</button></td>
          <td><button onclick="deleteUser(${i})" id="delete">Delete</button></td>
        </tr>`;
    }
  }
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
  for (let i = 0; i < elements.length; i++) {
    if (action === "add") {
      elements[i].classList.add(className);
    } else {
      elements[i].classList.remove(className);
    }
  }
}

function lightMode() {
  pageMode = pageMode === "dark" ? "light" : "dark";
  setMode(pageMode);
  localStorage.setItem("mode", pageMode);
  localStorage.setItem("lightDarkModeContent", document.getElementById("lightDarkModeBtn").innerHTML);
}

setMode(pageMode);
