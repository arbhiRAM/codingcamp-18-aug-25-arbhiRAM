document.addEventListener('DOMContentLoaded', function () {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoDate = document.getElementById('todo-date');
  const todoList = document.getElementById('todo-list');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const deleteAllBtn = document.getElementById('delete-all');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all';

  function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  function renderTodos() {
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
    });

    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
        <tr>
          <td colspan="4" class="py-4 text-center text-gray-500">Tidak ada tugas</td>
        </tr>
      `;
      return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
      <tr class="todo-item fade-in border-b ${todo.completed ? 'completed' : ''}">
        <td class="py-3 px-4">${todo.text}</td>
        <td class="py-3 px-4">${formatDate(todo.date)}</td>
        <td class="py-3 px-4">
          <span class="${todo.completed ? 'text-green-600' : 'text-yellow-600'}">
            ${todo.completed ? 'Selesai' : 'Aktif'}
          </span>
        </td>
        <td class="py-3 px-4 flex space-x-2">
          <button class="toggle-btn ${todo.completed ? 'bg-yellow-500' : 'bg-green-500'} text-white px-2 py-1 rounded text-sm" data-id="${todo.id}">
            ${todo.completed ? 'Batal' : 'Selesai'}
          </button>
          <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded text-sm" data-id="${todo.id}">Hapus</button>
        </td>
      </tr>
    `).join('');

    localStorage.setItem('todos', JSON.stringify(todos));
  }

  todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    const date = todoDate.value;

    if (text) {
      const newTodo = {
        id: Date.now(),
        text,
        date,
        completed: false
      };
      todos.push(newTodo);
      renderTodos();
      todoInput.value = '';
      todoDate.value = '';
    }
  });

  todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('toggle-btn')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      renderTodos();
    }

    if (e.target.classList.contains('delete-btn')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      todos = todos.filter(todo => todo.id !== id);
      renderTodos();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('filter-active', 'bg-blue-500', 'text-white'));
      filterBtns.forEach(b => b.classList.add('bg-gray-200'));

      this.classList.remove('bg-gray-200');
      this.classList.add('filter-active', 'bg-blue-500', 'text-white');

      currentFilter = this.getAttribute('data-filter');
      renderTodos();
    });
  });

  deleteAllBtn.addEventListener('click', function () {
    if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
      todos = [];
      renderTodos();
    }
  });

  renderTodos();
});