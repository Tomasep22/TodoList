import Tasks from './tasks.js'
import Projects from './projects.js'
import Events from './events.js'

const domModule = (function() {

// DOM STUFF
    
    let displaying = 'inbox';
    
// hay que hacer display el project que tiene title = a displaying

    // CONTENT
    const content = document.createElement('div');
    content.id = 'content';
    document.body.appendChild(content);


    const project = document.createElement('div');
    project.id = displaying;
    content.appendChild(project);
    const projectList = document.createElement('ul');
    project.appendChild(projectList)
    displayTasks(projectList);
   
    // display tasks with remove button on DOM
    function displayTasks(list = projectList) {
        const tasksDOM = Tasks.getTasks()
        list.innerHTML = tasksDOM.map((task, index) => {
            if(task.project !== displaying) return
            return `
            <li style="display: inline" data-idx="${index}">${task.title}</li>
            <button data-idx="${index}" class="remove">Remove Task</button>
            `
        }).join('');

        const rmButtons = document.querySelectorAll('.remove');
        rmButtons.forEach(btn => btn.onclick = removeTaskDom)
    }

    Events.on('tasksChanged', displayTasks);

    // button for adding tasks to DOM
    
    const button = document.createElement('button');
    content.appendChild(button);
    button.textContent = 'Add new task';
    button.onclick = CreateTask;


    function CreateTask() {
        const title = prompt('task title');
        Events.emit('createTask', title);
        Events.emit('tasksChanged', projectList);
    }

    // Remove task DOM
    
    function removeTaskDom() {
        const index = parseInt(this.dataset.idx);
        Events.emit('removeTask', index);
        Events.emit('tasksChanged', projectList);
    }

    return {
    }
}());

export default domModule