// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskDescription = document.getElementById('taskDescription');
  const taskContainer = document.getElementById('taskContainer');
  const confirmBox = document.querySelector('.confirm');
  const cancelBtn = document.querySelector('.cancel');
  const confirmBtn = document.querySelector('.confirmed');

  // Local state variables
  let tasks = [];                // Array to hold all tasks
  let taskToDeleteIndex = null; // Index of the task selected for deletion

  // Fetch all tasks when the page loads
  fetchTasks();

  // Handle form submission to create a new task
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form behavior (page reload)

    const title = taskInput.value.trim();
    const description = taskDescription.value.trim();

    // Only proceed if the title is not empty
    if (title !== '') {
      const newTask = { title, description };

      // Send a POST request to the backend to create a new task
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        // Clear input fields and refresh task list
        taskInput.value = '';
        taskDescription.value = '';
        fetchTasks();
      } else {
        alert('Failed to add task. Please try again.');
      }
    }
  });

  // Fetch all tasks from the server
  async function fetchTasks() {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const data = await response.json();
      tasks = data;
      renderTasks(); // Display the tasks on the page
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }

  // Send a PUT request to update a task's status
  async function updateTaskStatus(id, newStatus) {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  // Send a DELETE request to remove a task
  async function deleteTask(id) {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
      });
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }

  // Render all tasks on the page
  function renderTasks() {
    taskContainer.innerHTML = ''; // Clear current tasks

    tasks.forEach((task, index) => {
      // Create task card container
      const taskCard = document.createElement('div');
      taskCard.className = `taskCard ${task.status.toLowerCase()}`;

      // Add task title
      const taskTitle = document.createElement('h3');
      taskTitle.textContent = task.title;
      taskCard.appendChild(taskTitle);

      // Add description if available
      if (task.description !== '') {
        const taskDesc = document.createElement('p');
        taskDesc.textContent = task.description;
        taskDesc.style.color = '#444';
        taskCard.appendChild(taskDesc);
      }

      // Show created time
      const createdAt = document.createElement('div');
      createdAt.textContent = `Created: ${new Date(task.createdAt).toLocaleString()}`;
      createdAt.style.fontSize = '0.9rem';
      createdAt.style.color = '#777';
      createdAt.style.marginTop = '10px';
      taskCard.appendChild(createdAt);

      // Show current status
      const status = document.createElement('div');
      status.textContent = `Status: ${task.status}`;
      taskCard.appendChild(status);

      // Create button container
      const buttonsDiv = document.createElement('div');
      buttonsDiv.style.marginTop = '10px';

      // Create "In Progress" button
      const progressBtn = document.createElement('button');
      progressBtn.className = 'button-box green';
      progressBtn.textContent = 'In Progress';
      progressBtn.addEventListener('click', () => updateTaskStatus(task.id, 'In Progress'));

      // Create "Complete" button
      const completeBtn = document.createElement('button');
      completeBtn.className = 'button-box green';
      completeBtn.textContent = 'Complete';
      completeBtn.addEventListener('click', () => updateTaskStatus(task.id, 'Completed'));

      // Create "Delete" button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'button-box red';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        taskToDeleteIndex = index; // Save which task will be deleted
        showConfirm();             // Show confirmation modal
      });

      // Add buttons to button container
      buttonsDiv.appendChild(progressBtn);
      buttonsDiv.appendChild(completeBtn);
      buttonsDiv.appendChild(deleteBtn);
      taskCard.appendChild(buttonsDiv);

      // Change background color based on task status
      if (task.status === 'In Progress') {
        taskCard.style.background = 'linear-gradient(to right, #ffd700, #ffa500)';
      } else if (task.status === 'Completed') {
        taskCard.style.background = 'linear-gradient(to right,rgb(73, 206, 124),rgb(20, 191, 126))';
      }

      // Add task card to container
      taskContainer.appendChild(taskCard);
    });
  }

  // Show the delete confirmation popup
  function showConfirm() {
    confirmBox.style.display = 'block';
  }

  // Hide the confirmation box and reset delete index
  function hideConfirm() {
    confirmBox.style.display = 'none';
    taskToDeleteIndex = null;
  }

  // Cancel button hides the confirmation modal
  cancelBtn.addEventListener('click', hideConfirm);

  // Confirm delete: deletes the selected task and hides modal
  confirmBtn.addEventListener('click', () => {
    if (taskToDeleteIndex !== null) {
      const taskId = tasks[taskToDeleteIndex].id;
      deleteTask(taskId);
    }
    hideConfirm();
  });
});
