var todolist = [];
let taskCount;
let editindex = null;
const userEmail = localStorage.getItem("username");

function fetchtaskdata() {
  var storedTask = null; //sessionStorage.getItem("todolist") ||;
  if (storedTask) {
    console.log("the stored task in session storage", storedTask);
    todolist = JSON.parse(storedTask);
    taskCount = todolist.length;
    render("All");
    updatetaskcount();
  } else {
    console.log("the sessionstorage is empty");
    fetch(`http://localhost:3000/tasks?userName=${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        todolist = data;
        sessionStorage.setItem("todolist", JSON.stringify(todolist));

        storedTask = sessionStorage.getItem("todolist");

        taskCount = todolist.length;
        render("All");
        updatetaskcount();
      });
  }
}
window.onload = () => {
  fetchtaskdata();
};
function addtodo(event) {
  event.preventDefault();
  let values = document.querySelector(".name");
  let Date = document.querySelector(".dat");
  let catogery = document.querySelector(".catogery").value;
  let timer = document.querySelector(".time");
  let priority = document.querySelector(".Priority").value;

  //connecting to the backend

  if (
    values.value.trim() === "" ||
    Date.value.trim() === "" ||
    timer.value.trim() === "" ||
    catogery.trim() === "" ||
    priority.trim() === ""
  ) {
    //alert('please fill all the fields')
    return;
  }

  if (editindex != null) {
    // todolist[editindex] = task;
    // editindex = null;
    const id = todolist[editindex]._id;

    fetch(`http://localhost:3000/update/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: values.value,
        dat: Date.value,
        catogery: catogery,
        timer: timer.value,
        priority: priority,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated data from server:", data);
        todolist[editindex] = data;
        sessionStorage.removeItem("todolist");
        fetchtaskdata();
        updatetaskcount();
      });
    editindex = null;
  } else {
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: values.value,
        dat: Date.value,
        catogery: catogery,
        timer: timer.value,
        priority: priority,
        user: userEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Added task:", data);
        todolist.push(data);
        taskCount = todolist.length;
        sessionStorage.setItem("todolist", JSON.stringify(todolist));
        render("All");
        updatetaskcount();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // localStorage.setItem("todolist", JSON.stringify(todolist));
  // localStorage.setItem("taskCount", taskCount);

  values.value = "";
  Date.value = "";
  timer.value = "";
  document.querySelector(".catogery").value = "";
  document.querySelector(".Priority").value = "";
  render("All");

  updatetaskcount();
}

function render(catogery = "All") {
  let acc = "";
  let text = document.querySelector(".text");

  let filteredlist = todolist
    .map((task, index) => ({ ...task, index }))
    .filter((task) => catogery === "All" || task.catogery === catogery);

  filteredlist.sort((a, b) => {
    let aDateTime = new Date(`${a.dat}T${a.timer}`);
    let bDateTime = new Date(`${b.dat}T${b.timer}`);
    return aDateTime - bDateTime;
  });
  for (let i = 0; i < filteredlist.length; i++) {
    let element = filteredlist[i];

    let priorityClass = "";
    switch (element.priority) {
      case "low":
        priorityClass = "low-priority";
        break;
      case "medium":
        priorityClass = "medium-priority";
        break;
      case "high":
        priorityClass = "high-priority";
        break;
    }

    let buttons = element.completed
      ? ""
      : `
        <img src="https://img.icons8.com/ultraviolet/40/edit.png"
        class="edit-iconbutton"
        alt="Edit"
        onclick="edit(${element.index})">
        <img src="https://img.icons8.com/color-glass/48/filled-trash.png" alt="delete" class="delete-button" onclick="deletes('${element._id}', '${element.catogery}')">`;

    let htmll = `<div class='task ${priorityClass} ' draggable = "true" ondragstart='dragstart(event)' ondragover='dragover(event)' ondrop='drop(event)' ondragend=dragend(event) id='task${
      element.index
    }'>
            <div>
            


            <label class="custom-checkbox">

            <input type="checkbox"  class= 'check-task' title="check to mark task is completed " onclick="markasDone(${
              element.index
            })" ${element.completed ? "checked" : ""}>
            <span class="checkmark">✔</span>
            </label>
            </div>
           


            <div class='elems " ${
              element.completed ? "completed" : ""
            }' onclick="showpopup(${element.index} )">${element.name} </div> 
       <div class='vdat ${element.completed ? "completed" : ""}'>${
      element.dat
    }</div> <div class='vdat ${element.completed ? "completed" : ""}'>${
      element.timer
    }</div>
       ${buttons}
        </div>`;

    acc += htmll;
    let taskTime = new Date(`${element.dat}T${element.timer}`);
    let now = new Date();
    let delay = taskTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        alert(`remainder ${element.name} is due now `);
      }, delay);
    }
  }
  text.innerHTML = acc;
}

function deletes(id, catogery) {
  console.log("the delete id is ", id);
  fetch(`http://localhost:3000/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      todolist = todolist.filter((task) => task._id != id);
      sessionStorage.setItem("todolist", JSON.stringify(todolist));
      render((catogery = "All"));
      taskCount--;
      updatetaskcount();

      // fetchtaskdata();
    })
    .catch((err) => console.error(err));
  //  fetchtaskdata();
  // sessionStorage.setItem("todolist", JSON.stringify(todolist));
}

function edit(index) {
  let task = todolist[index];
  document.querySelector(".name").value = task.name;
  document.querySelector(".dat").value = task.dat;
  document.querySelector(".time").value = task.timer;
  document.querySelector(".catogery").value = task.catogery;
  document.querySelector(".Priority").value = task.priority;
  editindex = index;
}

function office() {
  render("Office");
  updatetaskcount();
}

function homes() {
  render("Home");
  updatetaskcount();
}

function All() {
  render("All");
  updatetaskcount();
}

function reset() {
  fetch("http://localhost:3000/deleteall", { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      fetchtaskdata();
      taskCount = 0;
      updatetaskcount();
    });
  sessionStorage.removeItem("todolist");

  // updatetaskcount();
  // render();
}

function markasDone(index) {
  const task = todolist[index];
  const updated = !task.completed;
  const id = task._id;
  task.completed = updated;

  render("All");
  updatetaskcount();

  fetch(`http://localhost:3000/update/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ ...task, completed: updated }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("modifiedData", data);
      todolist[index] = data;
      sessionStorage.setItem("todolist", JSON.stringify(todolist));
      render("All");
      updatetaskcount();
    });
  // localStorage.setItem("todolist", JSON.stringify(todolist));
  //   render(todolist[index].catogery);
  //   updatetaskcount();
}

let draggedTask = null;
function dragstart(event) {
  draggedTask = event.target;
  draggedTask.classList.add("dragging");
}

function dragover(event) {
  event.preventDefault();
  const draggedOverTask = event.target.closest(".task");
  if (
    draggedOverTask &&
    draggedOverTask != draggedTask &&
    draggedOverTask.classList.contains("task")
  ) {
    draggedOverTask.classList.add("over");
  }
}

function drop(event) {
  event.preventDefault();
  let dropTask = event.target.closest(".task");
  if (!dropTask || dropTask === draggedTask) {
    return;
  }
  dropTask.classList.remove("over");

  let temp = draggedTask.innerHTML;
  draggedTask.innerHTML = dropTask.innerHTML;
  dropTask.innerHTML = temp;

  const tempId = draggedTask.id;
  draggedTask.id = dropTask.id;
  dropTask.id = tempId;

  // localStorage.setItem("todolist", JSON.stringify(todolist));

  //updateorder();
}
function dragend(event) {
  if (draggedTask) {
    draggedTask.classList.remove("dragging");
  }
  document
    .querySelectorAll(".task.over")
    .forEach((task) => task.classList.remove("over"));

  draggedTask = null;
}

let imgstate = true;

function swap() {
  let img = document.querySelector(".toggle-image");
  img.src = imgstate ? "toggle on button.png" : "toggle button.png";
  document.body.classList.toggle("dark");

  imgstate = !imgstate;
}
function updatetaskcount() {
  let taskupdate = document.querySelector(".countTask");
  let filteredtask = todolist.filter((task) => task.completed).length;
  taskupdate.textContent = `Total task-${filteredtask} / ${taskCount}`;

  let percentage = taskCount > 0 ? (filteredtask / taskCount) * 100 : 0;

  let progressbar = document.querySelector(".progress-bar");
  progressbar.style.width = `${percentage}%`;
  progressbar.textContent = `${Math.round(percentage)}% `;

  if (percentage === 100) {
    progressbar.style.backgroundColor = "green";
  } else if (percentage < 80) {
    progressbar.style.backgroundColor = "blue";
  } else if (percentage < 50) {
    progressbar.style.backgroundColor = "yellow";
  } else if (percentage < 25) {
    progressbar.style.backgroundColor = "red";
  }
}

function download() {
  //let Todolist=JSON.stringify('todolist');
  let content = JSON.stringify(todolist, null, 2);
  let blob = new Blob([content], { type: "text/plane" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "task.txt";
  link.click();
}

function showpopup(index) {
  let task = todolist[index];
  document.getElementById("popup-title").textContent = task.name;
  document.getElementById("popdate").textContent = task.dat;
  document.getElementById("poptime").textContent = task.timer;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function closepopup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popup").style.display = "none";
}
