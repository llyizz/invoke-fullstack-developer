# Task Manager Application

A simple full-stack task management application that allows users to create, view, update, and delete tasks.

---

## 🚀 Project Overview

This project consists of:

- **Backend:** RESTful API built with Node.js and Express  
- **Frontend:** Single-page application built with vanilla JavaScript, HTML, and CSS

### Features
- View a list of tasks with title, status, and creation date  
- Add new tasks with title and optional description  
- Update task status (New, In Progress, Completed)  
- Delete tasks with confirmation

---

##  Project Structure

```
/backend
└── server.js         # Express server with REST API endpoints
/frontend
├── index.html        # Frontend HTML page
├── style.css         # CSS styling (embedded in HTML or linked)
└── script.js         # Frontend JavaScript for UI and API communication
README.md             # This file
```

---

##  Backend Setup

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14+ recommended).

2. Open a terminal and navigate to the `/backend` folder:

```bash
cd backend
```

3. Initialize and install dependencies:

```bash
npm init -y
npm install express cors
```

4. Start the backend server:

```bash
node server.js
```

> The server will run at: [http://localhost:3000](http://localhost:3000)

---

##  Frontend Setup

1. Open the `/frontend` folder.

2. Open `index.html` directly in your browser  
   *OR* serve it using a local HTTP server like **Live Server** in VSCode  :

3. Then open [http://localhost:8000](http://localhost:8000) in your browser.

> The frontend will communicate with the backend at `http://localhost:3000`.

---

