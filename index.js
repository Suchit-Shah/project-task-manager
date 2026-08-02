const express = require("express");
const app = express();

const port = process.env.PORT || 8000;

app.use(express.urlencoded({extended: true}));

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const{v4: uuidv4} = require("uuid");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));


let projects = [];
let tasks = [];

app.get("/projects", (req, res) => {
    let projectsWithStats = projects.map((p) => {
        let ptasks = tasks.filter((t) => t.pid == p.id);
        let total = ptasks.length;
        let done = ptasks.filter((t) => t.done).length;
        let percent = total === 0 ? 0 : Math.round((done / total) * 100);

        return {...p, total, done, percent};
    });

    res.render("index.ejs", {projects: projectsWithStats});
});

app.get("/projects/new", (req, res) => {
    res.render("new.ejs", {errorMsg: null});
});

app.post("/projects", (req, res) => {
    let {name} = req.body;

    if(!name || name.trim() == ""){
        return res.render("new.ejs", {errorMsg: "Project name cannot be empty"});
    }

    projects.push({
        id: uuidv4(),
        name: name
    });
    res.redirect("/projects");
});

app.get("/projects/:id", (req, res) => {
    let {id} = req.params;
    let {filter, sortPriority, sortDate} = req.query;
    filter = filter || "all";

    let project = projects.find((p) => p.id == id);
    let ftasks = tasks.filter((t) => t.pid == id);

    if(filter == "done"){
        ftasks = ftasks.filter((t) => t.done);
    }
    else if(filter == "undone"){
        ftasks = ftasks.filter((t) => !t.done);
    }

    if(sortPriority || sortDate){
        let rank = { high: 0, mid: 1, low: 2 };
        ftasks = [...ftasks].sort((a, b) => {
            if(sortPriority){
                let diff = rank[a.priority] - rank[b.priority];
                if (diff !== 0) return diff;
            }
            if(sortDate){
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        });
    }

    res.render("tasks.ejs", {project, ftasks, errorMsg: null, filter, sortPriority: !!sortPriority, sortDate: !!sortDate});
});

app.delete("/projects/:id", (req, res) => {
    let {id} = req.params;
    projects = projects.filter((p) => p.id != id);
    tasks = tasks.filter((t) => t.pid != id);

    res.redirect("/projects");
});

app.post("/projects/:id/tasks", (req, res) => {
    let {id} = req.params;
    let {title, date, priority} = req.body;
    let {sortPriority, sortDate} = req.query;

    let project = projects.find((p) => p.id == id);
    let ftasks = tasks.filter((t) => t.pid == id);

    if(sortPriority || sortDate){
        let rank = { high: 0, mid: 1, low: 2 };
        ftasks = [...ftasks].sort((a, b) => {
            if(sortPriority){
                let diff = rank[a.priority] - rank[b.priority];
                if (diff !== 0) return diff;
            }
            if(sortDate){
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        });
    }

    if(!title || title.trim()==""){
        return res.render("tasks.ejs", {project, ftasks, errorMsg: "Title cannot be empty", filter: "all", sortPriority: !!sortPriority, sortDate: !!sortDate});
    }

    let submittedDate = new Date(date);
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if(submittedDate < today) {
        return res.render("tasks.ejs", {project, ftasks, errorMsg: "Due date cannot be in the past", filter: "all", sortPriority: !!sortPriority, sortDate: !!sortDate});
    }

    if (!priority || priority.trim()=="") {
        return res.render("tasks.ejs", {project, ftasks, errorMsg: "Please select a priority", filter: "all", sortPriority: !!sortPriority, sortDate: !!sortDate});
    }

    tasks.push({
        id: uuidv4(),
        pid: id,
        title, //title: title,
        priority,
        done: false,
        dueDate: date,
    });
    res.redirect(`/projects/${id}`);
});

app.delete("/projects/:pid/tasks/:tid", (req, res) => {
    let {pid, tid} = req.params;
    tasks = tasks.filter((t) => t.id != tid);
    res.redirect(`/projects/${pid}`);
});

app.get("/projects/:pid/tasks/:tid/edit", (req, res) => {
    let {pid, tid} = req.params;
    let project = projects.find((p) => p.id == pid);
    let task = tasks.find((t) => tid == t.id);
    res.render("edit.ejs", {task, project, errorMsg: null});
});

app.put("/projects/:pid/tasks/:tid", (req, res) => {
    let {pid, tid} = req.params;
    let {title, date, priority} = req.body;

    let project = projects.find((p) => p.id == pid);
    let task = tasks.find((t) => tid == t.id);

    if(!title || title.trim() == ""){
        return res.render("edit.ejs", {task, project, errorMsg: "Title cannot be empty"});
    }

    let submittedDate = new Date(date);
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if(submittedDate < today) {
        return res.render("edit.ejs", {task, project, errorMsg: "Due date cannot be in the past"});
    }

    task.title = title;
    task.dueDate = date;
    task.priority = priority;
    res.redirect(`/projects/${pid}`);
});

app.patch("/projects/:pid/tasks/:tid/toggle", (req, res) => {
    let {pid, tid} = req.params;
    let task = tasks.find((t) => t.id == tid);

    task.done = !task.done;
    res.redirect(`/projects/${pid}`);
});

app.listen(port, () => {
    console.log(`Listening through port-${port}`);
});