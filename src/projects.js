import Events from './events.js'
import { formatDistance, subDays, differenceInCalendarDays, parseISO } from 'date-fns'

// projects factory

const projectFactory = (title, description, folder) => {
    title = prompt('title', 'project2');
    description = prompt('description', 'project2 description');
    const type = 'user'
    function displayRule(task) {
      return task.project === this.title ? true : false
    }
    return {
       title,
       description,
       displayRule,
       type
    };
  };

  const projectsModule = (function(){

    const COREPROJECTS = [
    {
      title:'Inbox',
      displayRule: function(task){
        if(task.project === this.title) {
          return true 
        } else {
          return false
        }
      },
      type: 'core'
    },
    {
      title: 'Today',
      get date() {
      return subDays(new Date(), 0)
      },
      displayRule: function(task) {
        if(differenceInCalendarDays(this.date, task.date) === 0) {
          console.log(true, 'display on today');
          return true
        } else {
          console.log(false, 'dont display on today');
          return false
        }
      },
      addTaskBtn: false,
      type: 'core'
    },
    {
      title: 'Tomorrow',
      get date() {
        return subDays(new Date(), -1)
        },
        displayRule: function(task) {
          if(differenceInCalendarDays(this.date, task.date) === 0) {
            console.log(true, 'display on tomorrow');
            return true
          } else {
            console.log(false, 'dont display on tomorrow');
            return false
          }
        },
        addTaskBtn: false,
        type: 'core'
    },
    {
      title:'This Week',
      get date() {
        return subDays(new Date(), -7)
      },
      displayRule: function(task) {
        if(differenceInCalendarDays(this.date, task.date) >= 0) {
            console.log(true, 'display on this week');
            return true
        } else {
            console.log(false, 'dont display on this week');
            return false
        }
      },
      addTaskBtn: false,
      type: 'core'
    }];

    let userProjects = [{title: 'project1', displayRule: function(task){
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

    function addProject () {
       const project = projectFactory();
       userProjects.push(project);
    }

    function removeProject(project) {
      const index = userProjects.findIndex(p => p === project);
     userProjects = [...userProjects.slice(0, index), ...userProjects.slice(index + 1)];
    }

  return {
  }
}())

export default projectsModule.projects 