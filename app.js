class Todo {
    constructor(title, description, dueDate, priority, notes = '', checklist = []) {
      this.title = title;
      this.description = description;
      this.dueDate = new Date(dueDate);
      this.priority = priority;
      this.notes = notes;
      this.checklist = checklist;
      this.completed = false;
    }
    
    toggleComplete() {
      this.completed = !this.completed;
    }
  }
  
  class Project {
    constructor(name) {
      this.name = name;
      this.todos = [];
    }
  
    addTodo(todo) {
      this.todos.push(todo);
    }
  
    removeTodo(index) {
      this.todos.splice(index, 1);
    }
    
    remove() {
      projects = projects.filter(p => p !== this);
      saveToLocalStorage();
      renderProjects();
      renderTodos(getCurrentProjectIndex());
    }
  }
  
  // Save and load data from localStorage
  function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
  }
  
  function loadFromLocalStorage() {
    const data = localStorage.getItem('projects');
    if (data) {
      return JSON.parse(data).map(project => {
        const p = new Project(project.name);
        p.todos = project.todos.map(todo => new Todo(
          todo.title,
          todo.description,
          todo.dueDate,
          todo.priority,
          todo.notes,
          todo.checklist
        ));
        return p;
      });
    }
    return [];
  }
  
  // Render projects and todos
  function renderProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.textContent = project.name;
      li.dataset.index = index;
      li.classList.add('project-item');
      li.addEventListener('click', () => {
        document.querySelectorAll('#projectList li').forEach(li => li.classList.remove('selected'));
        li.classList.add('selected');
        renderTodos(index);
      });
      
      // Add delete button for projects
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Project';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        projects[index].remove();
      };
      
      li.appendChild(deleteBtn);
      projectList.appendChild(li);
    });
  }
  
  function renderTodos(projectIndex) {
    const todoSection = document.getElementById('todoSection');
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
  
    if (projectIndex >= 0 && projects[projectIndex]) {
      const project = projects[projectIndex];
      project.todos.forEach((todo, index) => {
        const div = document.createElement('div');
        div.classList.add('todo-item', `${todo.priority}-priority`);
        div.innerHTML = `
          <h3>${todo.title}</h3>
          <p>Due: ${todo.dueDate.toDateString()}</p>
          <p>Priority: ${todo.priority}</p>
          <button onclick="toggleTodoDetail(${projectIndex}, ${index})">Details</button>
          <button onclick="deleteTodo(${projectIndex}, ${index})">Delete</button>
          <div class="todo-detail" id="todo-detail-${projectIndex}-${index}">
            <p>Description: ${todo.description}</p>
            <p>Notes: ${todo.notes}</p>
            <p>Checklist: ${todo.checklist.join(', ')}</p>
          </div>
        `;
        todoList.appendChild(div);
      });
    } else {
      todoList.innerHTML = '<p>No todos available. Please add some.</p>';
    }
  }
  
  function toggleTodoDetail(projectIndex, todoIndex) {
    const detail = document.getElementById(`todo-detail-${projectIndex}-${todoIndex}`);
    detail.classList.toggle('show');
  }
  
  function deleteTodo(projectIndex, todoIndex) {
    projects[projectIndex].removeTodo(todoIndex);
    renderTodos(projectIndex);
    saveToLocalStorage();
  }
  
  function createNewProject() {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      const newProject = new Project(projectName);
      projects.push(newProject);
      saveToLocalStorage();
      renderProjects();
    }
  }
  
  function createNewTodo() {
    const title = prompt('Enter to-do title:');
    const description = prompt('Enter to-do description:');
    const dueDate = prompt('Enter due date (YYYY-MM-DD):');
    const priority = prompt('Enter priority (high, medium, low):');
    const notes = prompt('Enter any notes:');
    const checklist = prompt('Enter checklist items separated by commas:').split(',').map(item => item.trim());
  
    if (!title || !description || !dueDate || !priority) {
      alert('Title, description, due date, and priority are required.');
      return;
    }
  
    const projectIndex = getCurrentProjectIndex();
    if (projectIndex >= 0) {
      const newTodo = new Todo(
        title,
        description,
        dueDate,
        priority.toLowerCase(),
        notes,
        checklist
      );
      projects[projectIndex].addTodo(newTodo);
      renderTodos(projectIndex);
      saveToLocalStorage();
    } else {
      alert('Please select a project.');
    }
  }
  
  function getCurrentProjectIndex() {
    const selectedProject = document.querySelector('#projectList li.selected');
    return selectedProject ? parseInt(selectedProject.dataset.index, 10) : -1;
  }
  
  // Initialization
  let projects = loadFromLocalStorage();
  document.getElementById('newProjectBtn').addEventListener('click', createNewProject);
  document.getElementById('newTodoBtn').addEventListener('click', createNewTodo);
  document.getElementById('saveBtn').addEventListener('click', saveToLocalStorage);
  
  window.onload = () => {
    if (projects.length > 0) {
      renderProjects();
      renderTodos(getCurrentProjectIndex()); // Render the first project by default
    }
  };
  