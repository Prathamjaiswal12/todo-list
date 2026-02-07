document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-task-btn");
  const list = document.getElementById("todo-list");
  const countText = document.getElementById("task-count");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(renderTask);
  updateCount();

  addBtn.addEventListener("click", addTask);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  function addTask() {
    const text = input.value.trim();
    if (!text) return;

    const task = {
      id: Date.now(),
      text,
      completed: false,
    };

    tasks.push(task);
    saveTasks();
    renderTask(task);
    updateCount();
    input.value = "";
  }

  function renderTask(task) {
    const li = document.createElement("li");

    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>
      <button><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
    `;

    li.querySelector("span").addEventListener("click", () => {
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
      updateCount();
    });

    li.querySelector("button").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      li.remove();
      saveTasks();
      updateCount();
    });

    list.appendChild(li);
  }

  function updateCount() {
    const completed = tasks.filter(t => t.completed).length;
    countText.textContent = `${completed} / ${tasks.length} completed`;
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
