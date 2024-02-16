const router = require("express").Router();
const { nanoid } = require("nanoid");

let tasks = [
  {
    id: nanoid(),
    title: "Work",
    text: "Do it!",
    done: false,
  },
];

router.post("/tasks", (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).send({
      status: "failure",
      code: 400,
      error:
        `Cannot create a task as passed data are not inlined with requirements`,
    });
  } else {
    const newTask = {
      id: nanoid(),
      title,
      text,
      done: false,
    };
    tasks.push(newTask);

    res.send({
      status: "success",
      code: 200,
      data: newTask,
    });
  }
});
router.get("/tasks", (req, res) => {
  res.send({
    status: "success",
    code: 200,
    data: tasks,
  });
});

router.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const task = tasks.find((task) => task.id === id);
  if (task) {
    res.send({
      status: "success",
      code: 200,
      data: task,
    });
  } else {
    // throw new Error("Cannot find ...");
    res.status(404).send({
      status: "failure",
      code: 404,
      error: `Cannot find a task whose id=${id}`,
    });
  }
});

router.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const taskIndexToBeDeleted = tasks.findIndex((task) => task.id === id);
  if (taskIndexToBeDeleted === -1) {
    res.status(404).send({
      status: "failure",
      code: 404,
      error: `Cannot deleted a task whose id=${id}`,
    });
  } else {
    tasks.splice(taskIndexToBeDeleted, 1);
    res.send({
      status: "success",
      code: 200,
      data: "The task has been deleted",
    });
  }
});

module.exports = router;
