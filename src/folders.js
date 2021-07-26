// folders factory

const folderFactory = (title, color) => {
    return {
        title,
        color
    };
  };

  const folderModule = (function(){
    const folders = [{title:'folder1'},{title:'folder2'}];

  function addFolder(title) {
      const folder = folderFactory(title)
      folders.push(project)
  }

  function removeFolder(index) {
    folders = [...folders.slice(0, index), ...folders.slice(index + 1)]
  }

  return {
    folders
  }
}())

export default folderModule