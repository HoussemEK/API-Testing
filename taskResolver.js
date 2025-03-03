let tasks = [
  { id: "1", title: "Task 1", description: "First task", completed: false },
  { id: "2", title: "Task 2", description: "Second task", completed: false },
];

const taskResolver = {
  Query: {
    task: (_, { id }) => tasks.find((task) => task.id === id),
    tasks: () => tasks,
  },
  Mutation: {
    addTask: (_, { title, description, completed, duration }) => {
      const task = {
        id: String(tasks.length + 1),
        title,
        description,
        completed,
        duration,
      };
      tasks.push(task);
      return task;
    },
    completeTask: (_, { id }) => {
      const task = tasks.find((task) => task.id === id);
      if (task) task.completed = true;
      return task;
    },
    changeDescription: (_, { id, description }) => {
      const task = tasks.find((task) => task.id === id);
      if (task) task.description = description;
      return task;
    },
    deleteTask: (_, { id }) => {
      const taskIndex = tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return true;
      }
      return false;
    },
  },
};

module.exports = taskResolver;
