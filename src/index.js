import Events from './events.js'
import Tasks from './tasks.js'
import projects from './projects.js'
import Style from './style.css'

const domModule = (function() {

    let userProjects = [];
    let coreProjects = [];

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

    const userProjectsDiv = document.createElement('div');
    userProjectsDiv.classList.add('user-projects');
    nav.appendChild(userProjectsDiv);

    Events.on('deliverUserProjects', updateUserProjects);
    Events.on('deliverCoreProjects', updateCoreProjects);

    function updateCoreProjects(projects) {
        coreProjects = projects
    }

    function updateUserProjects(projects) {
        userProjects = projects
    }
    Events.emit('updateCoreProjects');
    Events.emit('updateCoreProjects');

    // populate nav
    function populateNavDiv(node, projects) {
        console.log(projects)
        Events.emit('updateCoreProjects');
        Events.emit('updateUserProjects');
        console.log(projects)

        node.innerHTML = ''
        node.innerHTML = projects.map(project => {
            return `<button>${project.title}</button>`
        }).join('')
    }
    populateNavDiv(coreProjectsDiv, coreProjects);
    populateNavDiv(userProjectsDiv, userProjects);

    // display project

    // display tasks

    return {
    }
}());

export default domModule