import data from './data.json'
import fs from 'fs'
import * as readline from 'readline';

interface Task {
  id: number,
  description: string,
  status: string,
  createdAt: number,
  updatedAt: number
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// load tasks
const loadTasks = (): Task[] => {
  try {
    const data = fs.readFileSync('data.json', 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};
// save tasks
const saveTasks = (tasks: Task[]) => {
  fs.writeFileSync('data.json', JSON.stringify(tasks, null, 2));
};

// add, update and delete

const displayTask = () => {
  let tasks = loadTasks();
  console.log("\nChoose an action:");
  console.log("1. View all Task");
  console.log("2. View in-progres Task");
  console.log("3. View pending Task");
  console.log("4. View done Task");

  rl.question("Enter your choice: ", (taskChoice) => {
    switch (taskChoice) {
      case "1":
        console.table(tasks);
        mainMenu();
        break;
      case "2":
        console.table(tasks.filter(task => task.status === 'pending'))
        mainMenu();
        break;
      case "3":
        console.table(tasks.filter(task => task.status === 'in-progress'))
        mainMenu();
        break;
      case "4":
        console.table(tasks.filter(task => task.status === 'done'))
        mainMenu();
        break;
    }
  });
};

const addTask = () => {
  rl.question("Enter your Task: ", (Input) => {
    if (!Input.trim()) {
      console.log('Task can not be empty.');
      mainMenu();
      return
    }

    let tasks = loadTasks();
    const newTask: Task = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      description: Input,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    tasks.push(newTask);
    saveTasks(tasks);

    console.log("Successfully added task:", newTask);
    mainMenu();
  });
}

const updateTask = () => {
  let tasks = loadTasks();
  console.table(tasks);

  rl.question("Enter the Task ID to update: ", (idInput) => {
    const id = parseInt(idInput);
    const task = tasks.find(task => task.id === id);

    if (!task) {
      console.log("Task not found!");
      mainMenu();
      return;
    }

    rl.question("Enter new task description: ", (newDesc) => {
      task.description = newDesc;
      task.updatedAt = Date.now();

      saveTasks(tasks);
      console.log("Task description updated successfully:", task);
    });
  });
};

const updateStatus = () => {
  let tasks = loadTasks();
  console.table(tasks);

  rl.question("Enter the Task ID to update: ", (idInput) => {
    const id = parseInt(idInput);
    const task = tasks.find(task => task.id === id);

    if (!task) {
      console.log("Task not found!");
      mainMenu();
      return;
    }
    rl.question("Update status: ", (newStatus) => {
      task.status = newStatus;
      task.updatedAt = Date.now();

      saveTasks(tasks);
      console.log("Task status updated successfully:", task);
      mainMenu();
    });
  });
};

const deleteTask = () => {
  let tasks = loadTasks();
  console.table(tasks);

  rl.question("Enter the Task ID to update: ", (idInput) => {
    const id = parseInt(idInput);
    const filteredtask = tasks.filter(task => task.id !== id);

    if (filteredtask.length === tasks.length) {
      console.log("No errors found");
    }
    saveTasks(filteredtask);
    mainMenu();
  });
}



// **Main Menu**
const mainMenu = () => {
  console.log("\nChoose an action:");
  console.log("1. View Task");
  console.log("2. Add Task");
  console.log("3. Update Task");
  console.log("5. Update status(pending, in-progress, done)");
  console.log("4. Delete Task");
  console.log("6. Exit");

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        displayTask();
        break;
      case "2":
        addTask();
        break;
      case "3":
        updateTask();
        break;
      case "4":
        deleteTask();
      case "5":
        updateStatus();
        break;
      case "6":
        rl.close();
        break;

      default:
        console.log("Invalid choice, try again.");
        mainMenu();
    }
  });
};

// Start the program
mainMenu();