// Import required modules
const express = require('express');      // Express framework for handling routes and middleware
const cors = require('cors');            // Middleware to enable Cross-Origin Resource Sharing
const path = require('path');            // Node.js module for working with file paths
const app = express();                   // Initialize Express app

// Middleware setup
app.use(cors());                         // Allow cross-origin requests (useful during development)
app.use(express.json());                 // Parse incoming JSON requests

// Serve static frontend files (HTML, CSS, JS) from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory task list and unique ID counter
let tasks = [];
let idCounter = 1;

// =======================
// REST API Endpoints
// =======================

// GET /tasks - Return all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  // Validate that title exists and is a string
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Task title is required and must be a string.' });
  }

  // Create new task object
  const newTask = {
    id: idCounter++,                    // Assign a unique ID
    title,
    description: description || '',     // Default to empty string if no description provided
    status: 'New',                      // Default status
    createdAt: new Date().toISOString() // Timestamp for creation
  };

  tasks.push(newTask);                  // Add task to list
  res.status(201).json(newTask);        // Respond with created task
});

// PUT /tasks/:id - Update task status
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  // If task not found, return error
  if (!task) return res.status(404).json({ error: 'Task not found.' });

  const { status } = req.body;

  // Validate status value
  if (!['New', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  task.status = status;                // Update task status
  res.status(200).json(task);          // Respond with updated task
});

// DELETE /tasks/:id - Remove a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === taskId);

  // If task not found, return error
  if (index === -1) return res.status(404).json({ error: 'Task not found.' });

  tasks.splice(index, 1);             // Remove task from list
  res.status(204).send();             // Send empty response with 204 No Content
});

// Fallback route: serve index.html when visiting root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server on specified port
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
