document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskDescription = document.getElementById('taskDescription');
  const taskContainer = document.getElementById('taskContainer');
  const confirmBox = document.querySelector('.confirm');
  const cancelBtn = document.querySelector('.cancel');
  const confirmBtn = document.querySelector('.confirmed');

  let tasks = [];
  let taskToDeleteIndex = null;

  // Fetch all tasks from backend when page loads
  fetchTasks();

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    const description = taskDescription.value.trim();

    if (title !== '') {
      const newTask = { title, description };

      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        taskInput.value = '';
        taskDescription.value = '';
        fetchTasks();
      } else {
        alert('Failed to add task. Please try again.');
      }
    }
  });

  async function fetchTasks() {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const data = await response.json();
      tasks = data;
      renderTasks();
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }

  async function updateTaskStatus(id, newStatus) {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }

  function renderTasks() {
    taskContainer.innerHTML = '';

    tasks.forEach((task, index) => {
      const taskCard = document.createElement('div');
      taskCard.className = `taskCard ${task.status.toLowerCase()}`;

      const taskTitle = document.createElement('h3');
      taskTitle.textContent = task.title;
      taskCard.appendChild(taskTitle);

      if (task.description !== '') {
        const taskDesc = document.createElement('p');
        taskDesc.textContent = task.description;
        taskDesc.style.color = '#444';
        taskCard.appendChild(taskDesc);
      }

      const createdAt = document.createElement('div');
      createdAt.textContent = `Created: ${new Date(task.createdAt).toLocaleString()}`;
      createdAt.style.fontSize = '0.9rem';
      createdAt.style.color = '#777';
      createdAt.style.marginTop = '10px';
      taskCard.appendChild(createdAt);

      const status = document.createElement('div');
      status.textContent = `Status: ${task.status}`;
      taskCard.appendChild(status);

      const buttonsDiv = document.createElement('div');
      buttonsDiv.style.marginTop = '10px';

      const progressBtn = document.createElement('button');
      progressBtn.className = 'button-box green';
      progressBtn.textContent = 'In Progress';
      progressBtn.addEventListener('click', () => updateTaskStatus(task.id, 'In Progress'));

      const completeBtn = document.createElement('button');
      completeBtn.className = 'button-box green';
      completeBtn.textContent = 'Complete';
      completeBtn.addEventListener('click', () => updateTaskStatus(task.id, 'Completed'));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'button-box red';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        taskToDeleteIndex = index;
        showConfirm();
      });

      buttonsDiv.appendChild(progressBtn);
      buttonsDiv.appendChild(completeBtn);
      buttonsDiv.appendChild(deleteBtn);
      taskCard.appendChild(buttonsDiv);

      if (task.status === 'In Progress') {
        taskCard.style.background = 'linear-gradient(to right, #ffd700, #ffa500)';
      } else if (task.status === 'Completed') {
        taskCard.style.background = 'linear-gradient(to right,rgb(73, 206, 124),rgb(20, 191, 126))';
      }

      taskContainer.appendChild(taskCard);
    });
  }

  function showConfirm() {
    confirmBox.style.display = 'block';
  }

  function hideConfirm() {
    confirmBox.style.display = 'none';
    taskToDeleteIndex = null;
  }

  cancelBtn.addEventListener('click', hideConfirm);

  confirmBtn.addEventListener('click', () => {
    if (taskToDeleteIndex !== null) {
      const taskId = tasks[taskToDeleteIndex].id;
      deleteTask(taskId);
    }
    hideConfirm();
  });
});
