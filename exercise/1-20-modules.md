# 1-20 JavaScript modules: split the to-do list

You take the to-do list from lecture 2, which is one file, and split it into a module and a main program. The module
holds the list and the functions; the main program imports them and prints. On the way you meet ES modules
(`import`/`export`), the difference between returning a value and printing it, exceptions, and your first tests.

You work in `practice/1-20/`. When you are done it has these files:

```
practice/1-20/
├── lecture.js     the code from the lecture, your starting point (remove it when done)
├── todo.js        the module: the list and the functions
├── todo.test.js   tests for the module
└── main.js        the main program: uses the module and prints
```

## Background: ES modules

A module is a file that shares some of its code with other files. What it shares, it `export`s; the file that wants
it, `import`s it:

```js
// math.js
export function add(a, b) {
  return a + b
}
```

```js
// main.js
import { add } from './math.js'
console.log(add(1, 2))
```

The repo uses ES modules because `package.json` has `"type": "module"`. You may meet the older CommonJS form
(`require()` and `module.exports`) in the lectures and in older code on the web; it does the same job, but in this
course we write `import` and `export`. Note that the path in `import` is relative and ends in `.js`.

Everything in a module that is not exported stays private to it. That lets the module keep the list to itself and
decide how others may change it.

## 1. See where you are

This is the code from lecture 2. It is all in one file, and every function prints its result with `console.log()`:

```js
const toDoList = [];

function addTask(task) {
    if (task) {
        toDoList.push(task)
        console.log(`Task ${task} was added.`)
    }
    else {
        console.log("Please enter a valid task.")
    }
}

function displayTasks() {
    if (toDoList.length === 0) {
        console.log("Your to-do list is empty.")
    }
    else {
        console.log("Your to-do list:")
        toDoList.forEach((element, index) => {
            console.log(`${index + 1}.  ${element}`)
        });
    }
}

function deleteTask(index) {
    if (index > 0 && index <= toDoList.length) {
        const removed = toDoList.splice(index - 1, 1)
        console.log(`Task ${removed} was removed.`)
    }
    else {
        console.log("Please enter a valid task number.")
    }
}

addTask("Wash clothes");
addTask("Do the dishes");
addTask("Go for walk")
displayTasks();

deleteTask(2)
displayTasks();
```

1. Create `practice/1-20/lecture.js` and paste the code into it.
2. Run it from the root of your repo:

   ```bash
   node practice/1-20/lecture.js
   ```

3. Run the checks and see what ESLint and Prettier think about it:

   ```bash
   npm run check
   ```

   Prettier complains about the format. Run `npm run format`, open the file again and see what changed.

The code works, but it is hard to reuse and hard to test: the only result of a function is text on the screen. That is
what you change.

## 2. Create the module

The module `todo.js` keeps the list and exports the functions. The functions **return** values or **throw** an error;
they never print. The caller decides what to show.

Create `practice/1-20/todo.js` with this shape and fill in each numbered part:

```js
const tasks = []

export function addTask(task) {
  // 1. Throw an Error if task is empty
  // 2. Add the task last in the list
  // 3. Return the new length of the list
}

export function getTasks() {
  // 4. Return a copy of the list, so nobody outside can change it
}

export function deleteTask(number) {
  // 5. Throw an Error if number is outside 1 .. tasks.length
  // 6. Remove the task and return it
}

export function clearTasks() {
  // 7. Empty the list (the tests need this)
}
```

Do one function at a time. If you get stuck, open the solution for that function only, and try the next one
yourself.

<details>
<summary>A solution: <code>addTask()</code></summary>

```js
export function addTask(task) {
  if (!task) {
    throw new Error('Please enter a valid task.')
  }
  tasks.push(task)
  return tasks.length
}
```

</details>

<details>
<summary>A solution: <code>getTasks()</code></summary>

```js
export function getTasks() {
  return [...tasks]
}
```

</details>

<details>
<summary>A solution: <code>deleteTask()</code></summary>

```js
export function deleteTask(number) {
  if (number < 1 || number > tasks.length) {
    throw new Error('Please enter a valid task number.')
  }
  return tasks.splice(number - 1, 1)[0]
}
```

</details>

<details>
<summary>A solution: <code>clearTasks()</code></summary>

```js
export function clearTasks() {
  tasks.length = 0
}
```

</details>

`[...tasks]` makes a new array with the same items. If `getTasks()` returned `tasks` itself, the caller could change
the list without going through your functions.

## 3. Write the main program

The main program `main.js` imports the functions it needs and does all the printing. Create `practice/1-20/main.js`:

```js
import { addTask, getTasks, deleteTask } from './todo.js'

function printTasks() {
  const tasks = getTasks()
  if (tasks.length === 0) {
    console.log('Your to-do list is empty.')
    return
  }
  console.log('Your to-do list:')
  tasks.forEach((task, index) => console.log(`${index + 1}. ${task}`))
}

addTask('Wash clothes')
addTask('Do the dishes')
addTask('Go for a walk')
printTasks()

const removed = deleteTask(2)
console.log(`Task "${removed}" was removed.`)
printTasks()
```

Run it:

```bash
node practice/1-20/main.js
```

The output is the same as from the lecture code, but now the list lives in one file and the printing in another.

## 4. Catch an error

`deleteTask()` throws when the number is wrong. Add this last in `main.js` and run it again:

```js
try {
  deleteTask(42)
} catch (error) {
  console.log(error.message)
}
```

Try what happens without `try`/`catch`: the program stops with a stack trace. Put the `try` back.

## 5. Test the module

A test calls a function and checks the result. Since the module returns values instead of printing, it is easy to
test. Node has a test runner built in: `node:test` runs the tests and `node:assert` checks the results.

Create `practice/1-20/todo.test.js` next to the module:

```js
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { addTask, getTasks, deleteTask, clearTasks } from './todo.js'

// The list lives in the module, so empty it before each test.
beforeEach(() => clearTasks())

test('a new list is empty', () => {
  assert.deepEqual(getTasks(), [])
})

test('addTask adds a task last in the list', () => {
  addTask('Wash clothes')
  addTask('Do the dishes')
  assert.deepEqual(getTasks(), ['Wash clothes', 'Do the dishes'])
})

test('addTask throws on an empty task', () => {
  assert.throws(() => addTask(''), /valid task/)
})
```

Run the tests:

```bash
npm test
```

Then add two tests of your own: one that `deleteTask()` removes the right task and returns it, and one that it throws
on a number outside the list.

<details>
<summary>The two tests</summary>

```js
test('deleteTask removes by number, starting at 1', () => {
  addTask('Wash clothes')
  addTask('Do the dishes')
  assert.equal(deleteTask(1), 'Wash clothes')
  assert.deepEqual(getTasks(), ['Do the dishes'])
})

test('deleteTask throws on a number outside the list', () => {
  addTask('Wash clothes')
  assert.throws(() => deleteTask(2), /valid task number/)
})
```

</details>

## Check and commit

Remove `lecture.js` if you like, it has done its job. Then run all checks and commit:

```bash
npm run check
git add practice/1-20
git commit -m "1-20 Split the to-do list into a module"
```

If you have a remote of your own, push with `git push`.

### Verify

- [ ] `node practice/1-20/main.js` prints the list, removes a task and catches the error.
- [ ] `npm run check` passes, with your tests included.
- [ ] You can say why a function that returns a value is easier to test than one that prints.
- [ ] You can say what `export` and `import` do, and why `tasks` is not exported.

<details>
<summary><code>SyntaxError: Cannot use import statement outside a module</code></summary>

Node treats the file as CommonJS. Check that `package.json` has `"type": "module"` and that you run the file from
inside your repo.

</details>

<details>
<summary><code>Cannot find module '.../todo'</code></summary>

The import path needs the file ending: `'./todo.js'`, not `'./todo'`.

</details>

## Challenge

Turn the module into a class `TodoList` with the same methods, export it, and create two lists in `main.js`. What
changes in the tests? Do you still need `clearTasks()`?

## Read more

- The recorded lectures 2 and 3 in Canvas.
- Modules in JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- Node's test runner: https://nodejs.org/api/test.html
