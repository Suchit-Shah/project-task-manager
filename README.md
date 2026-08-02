# TaskBoard

A simple project & task manager built with Express and EJS. Organize tasks into projects, set priorities and due dates, filter and sort your task list, and track completion progress with a live progress bar.

**Live demo:** [https://project-task-manager-sz7p.onrender.com/projects]

> Note: This is a demo project using in-memory storage (no database). Data resets whenever the server restarts, so please don't rely on it to store anything important.

## Features

- Create and delete projects
- Add, edit, and delete tasks within a project
- Mark tasks as done/not done with a single click
- Filter tasks by status (All / Done / Not done)
- Sort tasks by priority and/or due date (can combine both)
- Per-project progress bar showing completed vs. total tasks
- Form validation (empty titles, missing priority, past due dates)

## Tech Stack

- **Backend:** Node.js, Express
- **Views:** EJS
- **Styling:** Plain CSS
- **Other:** `uuid` for unique IDs, `method-override` for PUT/PATCH/DELETE support via HTML forms

## Running Locally

**Requirements:** Node.js (v16+ recommended)

```bash
# Clone the repo
git clone https://github.com/Suchit-Shah/project-task-manager.git
cd project-task-manager

# Install dependencies
npm install

# Start the server
node index.js
```

The app will be running at `http://localhost:8000`.

## Project Structure

```
.
├── index.js          # Express app, routes, in-memory data
├── views/
│   ├── index.ejs      # Projects list + progress bars
│   ├── new.ejs         # New project form
│   ├── tasks.ejs        # Task list for a project (filter/sort/add)
│   └── edit.ejs           # Edit task form
├── public/            # Static CSS files
└── package.json
```

## Notes on Data Persistence

Projects and tasks are stored in plain JavaScript arrays in memory — there's no database. This keeps the project simple for demo purposes, but means:

- All data resets to the seed values on every server restart
- Free hosting tiers (like Render's) may restart the server after periods of inactivity, so don't expect changes to stick around long-term

If you wanted to extend this into something persistent, swapping the arrays for a database (e.g. MongoDB, PostgreSQL, or even a JSON file with `fs`) would be the natural next step.

## License

Free to use for learning purposes.
