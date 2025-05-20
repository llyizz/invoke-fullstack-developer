const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];
let idCounter = 1;

// GET all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Task title is required and must be a string.' });
  }

  const newTask = {
    id: idCounter++,
    title,
    description: description || '',
    status: 'New',
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT to update a task status
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) return res.status(404).json({ error: 'Task not found.' });

  const { status } = req.body;
  if (!['New', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  task.status = status;
  res.status(200).json(task);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === taskId);

  if (index === -1) return res.status(404).json({ error: 'Task not found.' });

  tasks.splice(index, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
