import Events from "./events.js";
import Tasks from "./tasks.js";
import projects from "./projects.js";
import Style from "./style.css";
import Openbox from "./img/open-box.png";
import { format } from "date-fns";

const domModule = (function () {
  let userProjects = [];
  let coreProjects = [];
  let tasks = [];
  let navOpen = false;

  const header = document.createElement('header');
  document.body.appendChild(header);

  const displayNavBtn = document.createElement('button');
  displayNavBtn.textContent = '≡';
  displayNavBtn.classList.add('button-nav-open');
  header.appendChild(displayNavBtn)

  const content = document.createElement("div");
  content.id = "content";
  document.body.appendChild(content);

  const nav = document.createElement("nav");
  nav.id = "nav";
  content.appendChild(nav);

  const coreProjectsDiv = document.createElement("div");
  coreProjectsDiv.classList.add("core-projects");
  nav.appendChild(coreProjectsDiv);

  const myProjectsHeading = document.createElement("h2");
  myProjectsHeading.classList.add("myprojects-heading");
  myProjectsHeading.textContent = "My Projects";
  nav.appendChild(myProjectsHeading);

  const userProjectsDiv = document.createElement("div");
  userProjectsDiv.classList.add("user-projects");
  nav.appendChild(userProjectsDiv);

  const addProjectBtn = document.createElement("button");
  addProjectBtn.textContent = "➕ New Project";
  addProjectBtn.classList.add("add-project", "active");
  nav.appendChild(addProjectBtn);

  const projectForm = document.createElement("form");
  projectForm.classList.add("add-project-form");
  projectForm.innerHTML = `<input class="add-project-input" name="newProjectTitle" type="text" placeholder="Project Title" value="New Project" required>`;
  nav.appendChild(projectForm);

  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project");
  content.appendChild(projectDiv);

  const editForm = document.createElement("form");
  editForm.classList.add("edit-form");
  content.appendChild(editForm);

  Events.on("deliverUserProjects", updateUserProjects);
  Events.on("deliverCoreProjects", updateCoreProjects);
  Events.on("deliverTasks", getTasks);

  function updateCoreProjects(projects) {
    coreProjects = projects;
  }

  function updateUserProjects(projects) {
    userProjects = projects;
  }

  function getTasks(array) {
    tasks = array;
  }

  function updateTasks() {
    Events.emit("updateTasks");
  }

  function updateProjects() {
    Events.emit("updateCoreProjects");
    Events.emit("updateUserProjects");
  }

  updateProjects();
  updateTasks();

  function populateNavDiv(node, projects) {
    updateProjects();
    node.innerHTML = projects
      .map((project, index) => {
        return `
            <div class="${project.type}-project-nav">
            <img class="project-icon" src="${project.icon}">
            <button data-idx="${index}" class="nav-project-btn">${
          project.title
        }</button>
            ${
              project.type === "user"
                ? `<button data-idx="${index}" class="rm-project-btn">❌</button>`
                : ""
            }
            </div>
            `;
      })
      .join("");

    const navButtons = node.querySelectorAll(".nav-project-btn");
    navButtons.forEach((btn) =>
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.idx);
        const project = projects.slice()[index];
        populateProject(project, projectDiv);
      })
    );

    const rmButtons = node.querySelectorAll(".rm-project-btn");
    rmButtons.forEach((btn) =>
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.idx);
        const deleteProject = projects.slice()[index];
        removeProject(deleteProject);
        updateProjects();
        removeDeletedProjectTasks(deleteProject, tasks);
        populateNavDiv(node, userProjects);
        populateProject(userProjects[index - 1] || coreProjects[0], projectDiv);
      })
    );
  }

  populateNavDiv(coreProjectsDiv, coreProjects);
  populateNavDiv(userProjectsDiv, userProjects);

  function populateProject(project, projectNode) {
    projectNode.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = project.title;
    projectNode.appendChild(title);

    const tasksDiv = document.createElement("div");
    tasksDiv.classList.add("project-tasks");
    projectNode.appendChild(tasksDiv);

    populateTasks(tasksDiv, project, tasks);

    project.type === "user" || "addTaskBtn" in project
      ? addTaskbtn(projectNode, project, tasksDiv)
      : "";
  }

  populateProject(coreProjects[0], projectDiv);

  function populateTasks(tasksNode, project, tasksArr) {
    updateTasks();
    tasksNode.innerHTML = "";
    tasksNode.innerHTML = tasksArr
      .map((task, index) => {
        // check if project should display task
        if (!project.displayRule(task)) return;
        let title = task.title;
        // include project title when task is displayed in a different project than where it is place
        if (project.type === "core" && task.project !== project.title) {
          const taskproject = task.project;
          title += " (" + taskproject + ")";
        }
        return `
            <label class="task" for="task${index}">
            <input data-idx="${index}" class="task-checkbox" id="task${index}" type="checkbox" name="tasks" value="${
          task.title
        }" ${task.done ? "checked" : ""}/>
            <div class="task-title-date">${
              task.date
                ? '<p class="task-date">' + task.formatDate() + "</p>"
                : ""
            }<p class="task-title" style="display: inline">${title}</p>
            </div>
            <div class="task-btns">
            <button data-idx="${index}" class="rm-task-btn">❌</button>
            <button data-idx="${index}" class="edit-task-btn">🖉</button>
            ${
              project.type === "user" || "storeTaskBtn" in project
                ? `<button data-idx="${index}" class="store-task-btn"><img class="store-img" src="${Openbox}"></button>`
                : ""
            }
            </div>
            </label>
            `;
      })
      .join("");

    const rmButtons = tasksNode.querySelectorAll(".rm-task-btn");
    rmButtons.forEach((btn) =>
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.idx);
        const task = tasks.slice()[index];
        removeTask(task);
        populateTasks(tasksNode, project, tasks);
      })
    );

    const editButtons = tasksNode.querySelectorAll(".edit-task-btn");
    editButtons.forEach((btn) =>
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.idx);
        editTaskForm(tasks.slice()[index], tasksNode, project, editForm);
      })
    );

    const storeButtons = tasksNode.querySelectorAll(".store-task-btn");
    storeButtons.forEach((btn) =>
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.idx);
        const task = tasks.slice()[index];
        const someday = { project: "Someday" };
        Events.emit("editTask", task, someday);
        populateTasks(tasksNode, project, tasks);
      })
    );

    const checkboxes = tasksNode.querySelectorAll(".task-checkbox");
    checkboxes.forEach((input) =>
      input.addEventListener("click", function () {
        const index = parseInt(this.dataset.idx);
        const task = tasks.slice()[index];
        const done = !task.done;
        Events.emit("editTask", task, { done });
      })
    );
  }

  function addTaskbtn(projectNode, project, tasksNode) {
    const btn = document.createElement("button");
    btn.classList.add("add-task-btn", "active");
    btn.textContent = "➕ New Task";
    projectNode.appendChild(btn);

    const form = document.createElement("form");
    form.classList.add("add-task-form");
    form.innerHTML = `<input class="add-task-input" name="newTaskTitle" type="text" placeholder="Task Title" value="New Task" required>`;
    projectNode.appendChild(form);

    btn.addEventListener("click", function () {
      form.classList.add("active");
      btn.classList.remove("active");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = this.newTaskTitle.value;
      createTask(project.title, title);
      form.classList.remove("active");
      btn.classList.add("active");
      populateTasks(tasksNode, project, tasks);
      this.reset();
    });
  }

  function createTask(project, title) {
    Events.emit("createTask", { project, title });
    updateTasks();
  }

  function removeTask(task) {
    Events.emit("removeTask", task);
    updateTasks();
  }

  function createProject(title) {
    Events.emit("createProject", title);
    updateProjects();
    populateNavDiv(userProjectsDiv, userProjects);
  }

  function removeProject(project) {
    Events.emit("removeProject", project);
    updateProjects();
  }

  function removeDeletedProjectTasks(deleted, tasks) {
    // when a project is removed, remove tasks that belonged to that project
    if (tasks.length > 0) {
      return tasks.map((task) => {
        if (task.project !== deleted.title) return;
        removeTask(task);
      });
    }
  }

  function cancelTaskEdit(form) {
    form.reset();
    document.body.classList.remove("edit-task");
  }

  function editTaskForm(task, tasksNode, currentProject, editForm) {
    editForm.innerHTML = "";
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => (btn.disabled = true));
    document.body.classList.add("edit-task");
    let dateValue = false;
    if (task.date) dateValue = formatDate(task.date);
    editForm.innerHTML = `
        <p>Title: <input type="text" name="titleinput" placeholder="Title" value="${
          task.title
        }" required></p>
        <p>Project: <select name="projectselect"><option value="${
          task.project
        }">${task.project}</option>${populateProjectSelect(
      userProjects,
      task.project
    )}</select></p>
        <p>Due-date: <input type="date" name="dateinput" value="${
          dateValue ? dateValue : ""
        }"></p>
        <div class="submit-edit-btn">
        <button type="submit" name="submitbtn">Edit</button>
        <button name="cancelbtn">Cancel</button>
        </div>`;

    editForm.addEventListener("submit", editTask);

    function editTask(e) {
      e.preventDefault();
      // if user cancels task edition
      if (e.submitter === editForm.cancelbtn) {
        buttons.forEach((btn) => (btn.disabled = false));
        editForm.removeEventListener("submit", editTask);
        return cancelTaskEdit(editForm);
      }
      const title = this.titleinput.value;
      const project = this.projectselect.value;
      let date = this.dateinput.value || null;
      // check if user included a date
      if (typeof date === "string") {
        date = handleDateInput(date);
        Events.emit("editTask", task, { title, project, date });
      } else {
        Events.emit("editTask", task, { title, project });
      }
      populateTasks(tasksNode, currentProject, tasks);
      document.body.classList.remove("edit-task");
      buttons.forEach((btn) => (btn.disabled = false));
      editForm.removeEventListener("submit", editTask);
    }
    editForm.reset();
  }

  function populateProjectSelect(projects, current) {
    return projects
      .map((project) => {
        if (project.title === current) return;
        return `<option value="${project.title}">${project.title}</option>`;
      })
      .join("");
  }

  function handleDateInput(date) {
    // browser input date data comes in this format: '2021-08-07' // String
    // when converting that into a date object the result is from a day before: new Date('2021-08-07') // Fri Aug 06 2021 ...
    // changing format to '2021,08,07' fixes this: new Date('2021,08,07') // Sat Aug 07 2021 ...
    return new Date(date.replaceAll("-", ","));
  }

  function formatDate(date) {
    return format(date, "yyyy-MM-dd");
  }

  function movileNavEnter(navNode) {
    navOpen = !navOpen;
    navNode.classList.add('nav-enter');
    setTimeout(() => navNode.classList.contains('nav-enter') && navNode.classList.add('nav-enter-active'), 150);
  }

  function movileNavLeave(navNode) {
    navOpen = !navOpen;
    navNode.classList.remove('nav-enter');
    navNode.classList.remove('nav-enter-active');
}
  addProjectBtn.addEventListener("click", function (e) {
    projectForm.classList.add("active");
    addProjectBtn.classList.remove("active");
  });

  projectForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = this.newProjectTitle.value;
    createProject(title);
    projectForm.classList.remove("active");
    addProjectBtn.classList.add("active");
    this.reset();
  });

  displayNavBtn.addEventListener('click', () => {
    if (navOpen) {
      movileNavLeave(nav);
    } else {
      movileNavEnter(nav);
    }
  });

  return {};
})();