# Task Management API with GraphQL

## Overview

This project is a simple task management API built using **GraphQL, Node.js, and Express**. It allows users to:

- Retrieve a list of tasks
- Add new tasks
- Mark tasks as completed
- Update task descriptions
- Delete tasks

## Technologies Used

- **Node.js**
- **Express.js**
- **GraphQL**
- **Apollo Server**

## Installation & Setup

### 1. Clone the repository

```sh
git clone ..
cd task-management-api
```

### 2. Install dependencies

```sh
npm install
```

### 3. Start the server

```sh
node index.js
```

### 4. Access GraphQL Playground

Open a browser and go to:

```
http://localhost:5000/graphql
```

## GraphQL Queries & Mutations

### Fetch all tasks

```graphql
query {
  tasks {
    id
    title
    description
    completed
  }
}
```

### Add a new task

```graphql
mutation {
  addTask(title: "New Task", description: "Task details", completed: false) {
    id
    title
  }
}
```

### Mark a task as completed

```graphql
mutation {
  completeTask(id: "1") {
    id
    title
    completed
  }
}
```

### Update task description

```graphql
mutation {
  changeDescription(id: "1", description: "Updated details") {
    id
    description
  }
}
```

### Delete a task

```graphql
mutation {
  deleteTask(id: "1")
}
```

## Notes

- Ensure **Node.js** is installed before running the project.
