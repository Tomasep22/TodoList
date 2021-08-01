import Events from './events.js'

const taskFactory = (title, project = 'inbox') => {
    return {
        title,
        project
    };
  };

const tasksModule = (function(){
    let tasks = [{title:'task1', priority: 'low', done: true, project:'project1'},{title:'task2', priority:'high', done: false, project:'inbox'}];

  
  function addTask(title) {
      const task = taskFactory(title);
      tasks.push(task);
  }

  function removeTask(index) {
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
  }

  return {
  }
  
}())

  export default tasksModule