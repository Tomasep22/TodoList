import Events from './events.js'
import projects from './projects.js';
import { format, parseJSON } from 'date-fns'


const taskFactory = (title, project, done = false) => {

  function formatDate() {
    return format(this.date, 'd.MMM')
  }

  return {
    title,
    project,
    done,
    formatDate
  };
};


const tasksModule = (function(){

    let tasks = []
    
    const tasksLocal = JSON.parse(localStorage.getItem('tasks')) || []
    const items = JSON.parse(localStorage.getItem('item')) || []
    
    
   if(localStorage.getItem('tasks')) {
    tasksLocal.forEach(t => {
      return addTask(t)
    })
    }

    if(localStorage.getItem('item')) {
        items.dates.forEach((d, idx) => {
        tasks[items.indexes[idx]].date = parseJSON(d)
      })
    }

  Events.on('updateTasks', deliverTasks);
  Events.on('createTask', addTask);
  Events.on('removeTask', removeTask);
  Events.on('editTask', handleUpdates);
 
  function getTasks() {
    return tasks.slice();
  }

  function deliverTasks() {
    Events.emit('deliverTasks', tasks.slice());
  }

  function addTask(obj) {
      const task = taskFactory(obj.title, obj.project, obj.done);
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks.slice()));
      handleLocalStorage()
  }

  function removeTask(task) {
    const index = tasks.findIndex(t => t === task);
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    handleLocalStorage()
  }

  function handleUpdates(task, obj) {
    const taskIndex = tasks.findIndex(t => t === task);
    Object.assign(tasks[taskIndex], obj);
    handleLocalStorage()
  }

  function handleLocalStorage() {
    const copy = tasks.slice();
    const dates = []
    const indexes = []
    copy.forEach((t,index) => {
      if('date' in t){
        console.log(t.date.toString(), index)
        dates.push(t.date)
        indexes.push(index);
      }
    });
    const item = {dates, indexes}
    localStorage.setItem('item', JSON.stringify(item));
    localStorage.setItem('tasks', JSON.stringify(tasks.slice()));
  }

  return {
    getTasks
  }
  
}())


  export default tasksModule