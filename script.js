document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-task-btn");
  const list = document.getElementById("todo-list");
  const countText = document.getElementById("task-count");
  const themeBtn = document.getElementById("theme-btn");
  const clearBtn = document.getElementById("clear-completed");

  // Load theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(savedTheme);

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  });

  // Load tasks
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(renderTask);
  updateCount();

  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });

  clearBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    list.innerHTML = "";
    tasks.forEach(renderTask);
    saveTasks();
    updateCount();
  });

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    const task = { id: Date.now(), text, completed: false };
    tasks.push(task);
    saveTasks();
    renderTask(task);
    updateCount();
    input.value = "";
  }

  function renderTask(task) {
    const li = document.createElement("li");
    if(task.completed) li.classList.add("completed");
    li.innerHTML = `<span>${task.text}</span><button>🗑️</button>`;

    // Toggle complete
    li.querySelector("span").addEventListener("click", () => {
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
      updateCount();
    });

    // Edit on double-click
    li.querySelector("span").addEventListener("dblclick", () => {
      const newText = prompt("Edit your task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        li.querySelector("span").textContent = task.text;
        saveTasks();
      }
    });

    // Delete task with animation
    li.querySelector("button").addEventListener("click", () => {
      li.classList.add("removing");
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        saveTasks();
        updateCount();
      }, 300);
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
