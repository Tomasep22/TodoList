import Events from './events.js'

const taskFactory = (title, project = 'inbox') => {
  title = prompt('title', 'task1');
    return {
        title,
        project
    };
  };

const tasksModule = (function(){
    let tasks = [{title:'task1', priority: 'low', done: true, project:'project1'},{title:'task2', priority:'high', done: false, project:'inbox'}];

  Events.on('updateTasks', getTasks);
  Events.on('createTask', addTask);

  function getTasks() {
    Events.emit('deliverTasks', tasks.slice());
  }

  function addTask() {
      const task = taskFactory();
      tasks.push(task);
  }

  function removeTask(index) {
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
  }

  return {
  }
  
}())

  export default tasksModule