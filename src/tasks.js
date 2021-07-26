import Events from './events.js'
// tasks factory

const taskFactory = (title, project = 'inbox') => {
    return {
        title,
        project
    };
  };

const tasksModule = (function(){
    let tasks = [{title:'task1', priority: 'low', done: true, project:'project1'},{title:'task2', priority:'high', done: false, project:'inbox'}];

  // create task object
  
  function addTask(title) {
      const task = taskFactory(title);
      tasks.push(task);
  }

  Events.on('createTask', addTask);

  // remove task object
  function removeTask(index) {
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
  }

  Events.on('removeTask', removeTask);

  // return tasks array
  function getTasks() {
    return tasks.slice()
  }
  function handleUpdates(task, prop, value) {
       task[prop] = value
  }
  return {
    tasks,
    addTask,
    handleUpdates,
    removeTask,
    getTasks
  }
  
}())

  export default tasksModule