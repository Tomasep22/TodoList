import Events from './events.js'

// projects factory
const projectFactory = (title, description, folder) => {
    return {
       title,
       description
    };
  };

  const projectsModule = (function(){

    const COREPROJECTS = [{title:'inbox'}, {title: 'today', }, {title: 'tomorrow'}, {title:'this week'}]
    let userProjects = [{title: 'project1'}]

    Events.on('updateCoreProjects', getCoreProjects);
    Events.on('updateUserProjects', getUserProjects);

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

    function removeProject(index) {
     userProjects = [...userProjects.slice(0, index), ...userProjects.slice(index + 1)]      
    }

  return {
  }
}())

export default projectsModule.projects 