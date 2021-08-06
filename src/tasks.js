import Events from './events.js'
import projects from './projects.js';
import { format, parseJSON } from 'date-fns'


const taskFactory = (title, project, done = false, date = false) => {

  function formatDate() {
    // format date for display
    if(this.date) return format(this.date, 'd.MMM');
  }

  if(date) date = parseJSON(date)

  return {
    title,
    project,
    done,
    date,
    formatDate
  };
};


const tasksModule = (function(){

    let tasks = [];
      
    // recreate objects from local storage
   if(localStorage.getItem('tasks')) {
    const tasksLocal = JSON.parse(localStorage.getItem('tasks'))
    tasksLocal.forEach(task => {
      return addTask(task);
    })
    }

  Events.on('updateTasks', deliverTasks);
  Events.on('createTask', addTask);
  Events.on('removeTask', removeTask);
  Events.on('editTask', handleUpdates);
 
  function getTasks() {
    return tasks.slice();
  }

  // send tasks to other modules
  function deliverTasks() {
    Events.emit('deliverTasks', tasks.slice());
  }

  function addTask(obj) {
      const task = taskFactory(obj.title, obj.project, obj.done, obj.date);
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks.slice()));
  }

  function removeTask(task) {
    const index = tasks.findIndex(t => t === task);
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    localStorage.setItem('tasks', JSON.stringify(tasks.slice()));
  }

  function handleUpdates(task, obj) {
    const taskIndex = tasks.findIndex(t => t === task);
    Object.assign(tasks[taskIndex], obj);
    localStorage.setItem('tasks', JSON.stringify(tasks.slice()));
  }

  return {
  }
  
}())


  export default tasksModule