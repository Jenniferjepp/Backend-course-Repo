import { addTask, getTasks, deleteTask, getTasksAsJson } from "./todo.js";


function printTasks () {
    const tasks = getTasks();

    if (tasks === 0) {
        console.log("The list is empty");
        return
    }
    
    for(let i = 0; i < tasks.length; i++) {
        console.log(`${i+1}. ${tasks[i]}`);
    }
}

addTask("wash clothes");
addTask("Do the dishes");
addTask("Go for a walk");
console.log(getTasks()); // console loggar det, utan denna hade jag ju inte sett ngt i terminalen.

printTasks();

const removed = deleteTask(2);
console.log(`Task ${removed} was removed`);
printTasks();


try {
    deleteTask(42)
  } catch (error) {
    console.log(error.message)
  }



function printTasksFromJson () {
    const list = JSON.parse(getTasksAsJson());

    if (list.length === 0) {
        console.log("Your list is empty");
    }

    for (let i = 0; i < list.length; i++) {
        console.log(list[i].number, list[i].task);
    }
    
}

printTasksFromJson();