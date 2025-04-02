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

rl.question("Enter your Task: ", (Input) => {
  if (!Input.trim()) {
    console.log('Task can not be empty.');
    rl.close()
    return
  }

  fs.readFile('data.json', 'utf8', (err, data) => {
    let tasks: Task[] = [];

    if (!err && data) {
      try {
        tasks = JSON.parse(data);
      } catch (parseError) {
        console.log('Error parsing the file', parseError)
      }
    }

    const newTasks = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      description: Input,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    tasks.push(newTasks);


    fs.writeFile('data.json', JSON.stringify(tasks), (writeErr) => {
      if (writeErr) {
        console.log("Error occured while writing the file", writeErr)
      }
      else {
        console.log("File succesfuly updated!")
      }
      rl.close();
    });
  });
});