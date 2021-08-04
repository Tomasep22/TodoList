import Events from './events.js'
import Tasks from './tasks.js'
import projects from './projects.js'
import Style from './style.css'
import { format } from 'date-fns'

const domModule = (function() {

    let userProjects = [];
    let coreProjects = [];
    let tasks = [];

    // CONTENT
    const content = document.createElement('div');
    content.id = 'content';
    document.body.appendChild(content);
    const nav = document.createElement('nav');
    nav.id = 'nav';
    content.appendChild(nav);

    const coreProjectsDiv = document.createElement('div');
    coreProjectsDiv.classList.add('core-projects');
    nav.appendChild(coreProjectsDiv);

    const myProjectsHeading = document.createElement('h2');
    myProjectsHeading.classList.add('myprojects-heading')
    myProjectsHeading.textContent = 'My Projects'
    nav.appendChild(myProjectsHeading)

    const userProjectsDiv = document.createElement('div');
    userProjectsDiv.classList.add('user-projects');
    nav.appendChild(userProjectsDiv);

    const addProjectBtn = document.createElement('button');
    addProjectBtn.textContent = '➕ Project';
    addProjectBtn.classList.add('add-project');
    nav.appendChild(addProjectBtn);

    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project');
    content.appendChild(projectDiv);

    Events.on('deliverUserProjects', updateUserProjects);
    Events.on('deliverCoreProjects', updateCoreProjects);
    Events.on('deliverTasks', getTasks);

    function updateCoreProjects(projects) {
        coreProjects = projects
    }

    function updateUserProjects(projects) {
        userProjects = projects
    }

    function getTasks(array) {
        tasks = array;
    }

    function updateTasks() {
        Events.emit('updateTasks')
    }

    function updateProjects() {
        Events.emit('updateCoreProjects');
        Events.emit('updateUserProjects');
    }

    updateProjects();
    updateTasks();

    function populateNavDiv(node, projects) {
        updateProjects();
        node.innerHTML = projects.map((project, index) => {
            return `
            <div class="${project.type}-project-nav">
            <img class="project-icon" src="${project.icon}">
            <button data-idx="${index}" class="nav-project-btn">${project.title}</button>
            ${project.type === 'user' ? `<button data-idx="${index}" class="rm-project-btn">❌</button>` : ""}
            </div>
            `
        }).join('');

        const navButtons = node.querySelectorAll('.nav-project-btn');
        navButtons.forEach(btn => btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.idx);
            const project = projects.slice()[index];
            populateProject(project, projectDiv);
        }));

        const rmButtons = node.querySelectorAll('.rm-project-btn')
        if(rmButtons.length > 0) {
            rmButtons.forEach(btn => btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.idx);
                const deleteProject = projects.slice()[index];
                removeProject(deleteProject);
                updateProjects();
                removeDeletedProjectTasks(deleteProject, tasks)
                populateNavDiv(node, userProjects);
            }))
        }
    }

    populateNavDiv(coreProjectsDiv, coreProjects);
    populateNavDiv(userProjectsDiv, userProjects);

    function populateProject(project, projectNode) {

        console.log(project);
        projectNode.innerHTML = '';

        const title = document.createElement('h1');
        title.textContent = project.title;
        projectNode.appendChild(title);

        const description = document.createElement('p');
        if('description' in project) description.textContent = project.description
        projectNode.appendChild(description);

        const tasksDiv = document.createElement('div');
        tasksDiv.classList.add('project-tasks');
        projectNode.appendChild(tasksDiv);

        populateTasks(tasksDiv, project, tasks);

        if(!('addTaskBtn' in project)) addTaskbtn(projectNode, project, tasksDiv);

    }

    populateProject(coreProjects[0], projectDiv);

    function populateTasks(node, project, tasksArr) {
        updateTasks();
        node.innerHTML = '';
        node.innerHTML = tasksArr.map((task, index) => {
            if(project.displayRule(task) === false) return
            let title = task.title;
            if(project.type === 'core' && project.title !== 'Inbox') {
                const taskproject = task.project;
                title += ' (' + taskproject + ')'
            }
            return `
            <label class="task" for="task${index}"><input id="task${index}" type="checkbox" name="tasks" value="${task.title}">${'date' in task ? '<p>' + task.formatDate() + '</p>' : ''}<p style="display: inline">${title}</p>
            <button data-idx="${index}" class="rm-task-btn">❌</button>
            <button data-idx="${index}" class="edit-task-btn">🖉</button>
            </label>
            `
        }).join('');

        const rmButtons = node.querySelectorAll('.rm-task-btn');
        rmButtons.forEach(btn => btn.addEventListener('click', function(){
            const index = parseInt(this.dataset.idx);
            const task = tasks.slice()[index]
            removeTask(task)
            populateTasks(node, project, tasks);
        }));

        const editButtons = node.querySelectorAll('.edit-task-btn');
        editButtons.forEach(btn => btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.idx);
            editTaskForm(tasks.slice()[index], node, project);
        }))
    }

    function addTaskbtn(projectNode, project, tasksNode) {
        const btn = document.createElement('button');
        btn.classList.add('add-task-btn','active');
        btn.textContent = '➕ Task';
        projectNode.appendChild(btn);

        const form = document.createElement('form');
        form.classList.add('add-task-input');
        form.innerHTML = `<input name="newTaskTitle" type="text" placeholder="Task Title" value="New Task">`
        projectNode.appendChild(form);

        btn.addEventListener('click', function() {
            form.classList.add('active')
            btn.classList.remove('active');
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = this.newTaskTitle.value;
            createTask(project.title, title);
            form.classList.remove('active');
            btn.classList.add('active');
            populateTasks(tasksNode, project, tasks);
        });
    }

    function createTask(project, title) {
        Events.emit('createTask', {project, title});
        updateTasks();
        console.log(tasks)
    }

    function removeTask(task) {
        Events.emit('removeTask', task);
        updateTasks();
    }

    function createProject() {
        Events.emit('createProject');
        updateProjects();
        populateNavDiv(userProjectsDiv, userProjects);
    }

    function removeProject(project) {
        Events.emit('removeProject', project);
        updateProjects();
    }

    function removeDeletedProjectTasks(deleted, tasks) {
        if(tasks.length > 0) {
        return  tasks.map((task) => {
                if(task.project !== deleted.title) return
                removeTask(task);
            });
        }
    }

    function cancelTaskEdit(form) {
        form.reset();
        document.body.classList.remove('edit-task');
    }

    function editTaskForm(task, node, currentProject) {
        const editForm = document.createElement('form');
        editForm.classList.add('edit-form');
        document.body.classList.add('edit-task');
        let dateValue = false;
        if('date' in task) dateValue = formatDate(task.date);
        editForm.innerHTML = `
        <p>Title: <input type="text" name="titleinput" placeholder="Title" value="${task.title}" required></p>
        <p>Project: <select name="projectselect"><option value="${task.project}">${task.project}</option>${populateProjectSelect(userProjects, task.project)}</select></p>
        <p>Due-date: <input type="date" name="dateinput" value="${dateValue ? dateValue : ''}"></p>
        <div class="submit-edit-btn">
        <button type="submit" name="submitbtn">Edit</button>
        <button name="cancelbtn">Cancel</button>
        </div>`
        content.appendChild(editForm);
        editForm.addEventListener('submit', function(e){
            e.preventDefault();
            if(e.submitter === editForm.cancelbtn) return cancelTaskEdit(editForm)
            const title = this.titleinput.value;
            const project = this.projectselect.value;
            let date = this.dateinput.value;
            date = handleDateInput(date);
            Events.emit('editTask', task, {title, project, date});
            populateTasks(node, currentProject, tasks);
            document.body.classList.remove('edit-task');
        });
    }

    function populateProjectSelect(projects, current) {
        return projects.map(project => {
            if(project.title === current) return
            return `<option value=${project.title}>${project.title}</option>`
        }).join('');
    }

    function handleDateInput(date) {
        return new Date(date.replaceAll('-',','));
    }

    function formatDate(date) {
        return format(date, 'yyyy-MM-dd');
    }

    addProjectBtn.addEventListener('click', createProject);

    return {
    }
}());
