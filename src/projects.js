import Events from './events.js'

// projects factory
const projectFactory = (title, description, folder) => {
    return {
       title,
       description
    };
  };

  const projectsModule = (function(){
    const projects = [{title:'inbox', tasks: []},{title:'project1', tasks: []}];

  function addProject(title) {
      const project = projectsFactory(title)
      projects.push(project)
  }

  function removeProject(index) {
    projects = [...projects.slice(0, index), ...projects.slice(index + 1)]
  }

  return {
    projects
  }
}())

export default projectsModule.projects 