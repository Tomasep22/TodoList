import Events from './events.js'
import projects from './projects.js';
import { formatDistance, subDays, differenceInCalendarDays, parseISO, format } from 'date-fns'

const tasksModule = (function(){
    let tasks = [{title:'task1', priority: 'low', done: true, project:'project1'},{title:'task2', priority:'high', done: false, project:'Inbox', date: new Date('2021,08,08'), formatDate: function() {return format(this.date, 'd. MMM')}}];

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
      const task = taskFactory(obj.title, obj.project);
      tasks.push(task);
  }

  function removeTask(task) {
    const index = tasks.findIndex(t => t === task);
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
  }

  function handleUpdates(task, obj) {
    const taskIndex = tasks.findIndex(t => t === task);
    Object.assign(tasks[taskIndex], obj);
  }
  return {
    getTasks
  }
  
}())

const taskFactory = (title, project) => {
  const arr = tasksModule.getTasks()
  const repeated = arr.reduce((count, task) => {
    if(task.title === title && task.project === project) count++
    return count
  },0);
  function formatDate() {
    return format(this.date, 'd.MMM')
  }
  return {
    title,
    project,
    repeated,
  };
};


  export default tasksModule