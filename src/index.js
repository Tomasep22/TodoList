import Events from './events.js'
import Tasks from './tasks.js'
import projects from './projects.js'
import Style from './style.css'
import { formatDistance, subDays, differenceInCalendarDays } from 'date-fns'

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
    Events.emit('updateCoreProjects');

    const userProjectsDiv = document.createElement('div');
    userProjectsDiv.classList.add('user-projects');
    nav.appendChild(userProjectsDiv);
    Events.emit('updateUserProjects');

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
            return `<button data-idx="${index}" class="nav-btn">${project.title}</button>`
        }).join('');

        const navButtons = node.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.idx);
            const project = projects[index];
            populateProject(project, projectDiv);
        }));
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
        // description.textcontent = project.description
        projectNode.appendChild(description);

        const tasksDiv = document.createElement('div');
        projectNode.appendChild(tasksDiv);

        populateTasks(tasksDiv);
        addTaskbtn(projectNode);

        // display tasks that belong to this project logic
    }

    function populateTasks(node) {
        console.log(tasks)
        console.log(differenceInCalendarDays(Date.now(), new Date('2021,08,08')))
    }

    function addTaskbtn(node) {
        const btn = document.createElement('button');;
        btn.textContent = 'Add new Task';
        node.appendChild(btn);
        btn.onclick = createTask;
    }

    function createTask() {
        Events.emit('createTask');
        updateTasks();
        console.log(tasks);
    }

    // display project

    // display tasks

    return {
    }
}());

export default domModule