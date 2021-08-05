import Events from './events.js'
import { subDays, differenceInCalendarDays, differenceInCalendarWeeks, nextSunday } from 'date-fns'
import Inbox from './img/inbox.png'
import Today from './img/calendar.png'
import Tomorrow from './img/tomorrow.png'
import Nextweek from './img/next-week.png'
import Todolist from './img/to-do-list.png'
import Openbox from './img/open-box.png'
  const projectsModule = (function(){

    const COREPROJECTS = [
    {
      title:'Inbox',
      icon: Inbox,
      displayRule: function(task){
        if(task.project === this.title) {
          return true 
        } else {
          return false
        }
      },
      type: 'core',
      storeTaskBtn: true,
      addTaskBtn: true
    },
    {
      title: 'Today',
      icon: Today,
      get date() {
      return subDays(new Date(), 0)
      },
      displayRule: function(task) {
        if(differenceInCalendarDays(this.date, task.date) === 0) {
          return true
        } else {
          return false
        }
      },
      type: 'core',
    },
    {
      title: 'Tomorrow',
      icon: Tomorrow,
      get date() {
        return subDays(new Date(), -1)
        },
        displayRule: function(task) {
          if(differenceInCalendarDays(this.date, task.date) === 0) {
            return true
          } else {
            return false
          }
        },
        type: 'core'
    },
    {
      title:'This Week',
      icon: Nextweek,
      get date() {
        return nextSunday(new Date());
      },
      displayRule: function(task) {
        if(differenceInCalendarWeeks(this.date, task.date, { weekStartsOn: 1}) === 0) {
            return true
        } else {
            return false
        }
      },
      type: 'core'
    },
    {
      title:'Someday',
      icon: Openbox,
      displayRule: function(task){
        if(task.project === this.title) {
          return true 
        } else {
          return false
        }
      },
      type: 'core'
    },
  ];

    let userProjects = [{title: 'project1', icon: Todolist, displayRule: function(task){
      return task.project === this.title ? true : false
    },
    type: 'user'}];

    Events.on('updateCoreProjects', getCoreProjects);
    Events.on('updateUserProjects', getUserProjects);
    Events.on('createProject', addProject);
    Events.on('removeProject', removeProject);

    function getUserProjects() {
      const projects = userProjects.slice();
      Events.emit('deliverUserProjects', projects);
    }

    function getCoreProjects() {
      const projects = COREPROJECTS.slice();
      Events.emit('deliverCoreProjects', projects);
    }

    function addProject (title) {
       const project = projectFactory(title);
       userProjects.push(project);
    }

    function removeProject(project) {
      const index = userProjects.findIndex(p => p === project);
     userProjects = [...userProjects.slice(0, index), ...userProjects.slice(index + 1)];
    }

    function gUserProjects() {
      return userProjects.slice()
    }
  return {
    gUserProjects
  }
}())

const projectFactory = (title) => {

  const icon = Todolist
  const type = 'user'
  function displayRule(task) {
    return task.project === this.title ? true : false
  }

const arr = projectsModule.gUserProjects();

function repeat(title) {
  return arr.reduce((count, project) => {
    if(project.title === title) count++
    return count
  },0);
}

let count = repeat(title)

function updateTitle(projectTitle) {
  const repeated = repeat(projectTitle)
  if (repeated < 1) {
    title = projectTitle
    return
  }
  
  let newTitle = projectTitle
  newTitle = title + `(${count})`
  count++
  updateTitle(newTitle)
}

updateTitle(title);

  return {
     title,
     icon,
     displayRule,
     type
  };
};

export default projectsModule.projects 