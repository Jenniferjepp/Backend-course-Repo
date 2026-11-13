# ES modules in Node.js

A program soon grows too large for one file. A **module** is a file of its own that shares some of its code with the
rest of the program, and keeps the rest private. This article goes through how modules work in this course, ES modules
(ESM) with `import` and `export`, and how they compare with the `require()` you meet in the recorded lectures.

You use modules from exercise [1-20 Modules](../exercise/1-20-modules.md) on, and every week after that.

## Why split code into modules

- **One file, one responsibility.** `todo.js` keeps the to-do list, `main.js` runs the program. You find things where
  you expect them, and a change in one place is less likely to break another.
- **A small public face.** A module decides what others may use. What it does not export, nobody else can touch, so it
  can be changed without breaking the code that uses the module.
- **Testable parts.** A module that exports functions can be imported by a test file and tested on its own, without
  starting the whole program.

## ESM is switched on in `package.json`

Node.js has two module systems: ES modules (`import`/`export`, the JavaScript standard, also used in the browser) and
the older CommonJS (`require()`/`module.exports`, Node's own). The course uses ESM. Your repo says so in `package.json`:

```json
{
  "type": "module"
}
```

With `"type": "module"` every `.js` file in the repo is an ES module. Without it Node treats `.js` files as CommonJS
(it guesses ESM when it sees `import`, with a warning). A file ending in `.mjs` is always ESM and one ending in `.cjs`
always CommonJS, whatever `package.json` says.

## Named exports

Put `export` in front of a function, a constant or a class to make it part of the module's public face. This is
`practice/1-20/todo.js` from exercise 1-20, shortened:

```js
const tasks = []

export function addTask(task) {
  tasks.push(task)
  return tasks.length
}

export function getTasks() {
  return [...tasks]
}
```

`addTask()` and `getTasks()` are exported, the array `tasks` is not. It is private to the module: the only way to
reach the list from outside is through the functions. `getTasks()` even returns a copy, `[...tasks]`, so the caller
cannot change the list behind the module's back.

Another file imports what it needs, by name, inside curly braces:

```js
import { addTask, getTasks } from './todo.js'

addTask('Wash clothes')
console.log(getTasks())
```

The names must match the exports. A name the module does not export is an error when the program starts, before any
code has run:

```text
SyntaxError: The requested module './todo.js' does not provide an export named 'getTask'
```

### Rename, or take everything

`as` gives an import another name in this file, for example when two modules export the same name:

```js
import { getTasks as getTodo } from './todo.js'
```

`import * as` collects all the exports of a module in one object:

```js
import * as todo from './todo.js'

todo.addTask('Wash clothes')
console.log(todo.getTasks())
```

## Default exports

A module can also have one **default export**, imported without curly braces and under any name you choose:

```js
// greeting.js
export default function greet(name) {
  return `Hello ${name}`
}

// main.js
import greet from './greeting.js'
```

You meet default exports in packages: `import express from 'express'` next week is one. In your own code the course
uses named exports: the name is the same everywhere it is used, which makes the code easier to search, and your editor
can suggest it when you type.

## The path in `import`

Where the module comes from decides how you write it:

| You import | Write | Example |
|---|---|---|
| A file of your own | A relative path, **with** the file ending | `'./todo.js'`, `'../src/http-app.js'` |
| A module built into Node | `node:` and its name | `'node:http'`, `'node:test'`, `'node:fs/promises'` |
| A package installed with npm | The package name | `'express'` (week 2) |

The file ending is not optional in ESM, unlike in CommonJS. Leave it out and Node does not find the file, but it tells
you what you probably meant:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../practice/1-20/todo' imported from .../practice/1-20/main.js
Did you mean to import "./todo.js"?
```

The path is relative to the file that has the `import`, not to the directory you run `node` from. `./` is the same
directory as the file, `../` the one above.

## A module runs once

The first time a module is imported, Node runs its code and keeps the result. Every later import, from any file, gets
the same module: the code does not run again, and its variables are shared.

That is why the to-do list works across files: `main.js` and anything else that imports `todo.js` see the same
`tasks` array. It also matters in tests. All the tests in a file share the module and its list, so a task one test
adds is still there in the next one. The tests in 1-20 empty the list before each test:

```js
beforeEach(() => clearTasks())
```

Read more about that in [Testing with Node.js](testing-with-node.md).

## More you get with ESM

- **`await` at the top level.** In an ES module you may use `await` outside a function, for example to wait for a
  database connection before the server starts.
- **`import.meta.dirname` and `import.meta.filename`** give the directory and the path of the current file. In
  CommonJS they are called `__dirname` and `__filename`, which do not exist in ESM. You need them to point at files
  next to your code, such as the templates in week 2.
- **Strict mode** is always on: assigning to a variable you have not declared is an error instead of a new global
  variable.

## ESM and CommonJS side by side

The recorded lectures and many examples on the web use CommonJS. The ideas are the same; the words differ:

| | ES modules (this course) | CommonJS |
|---|---|---|
| Share a function | `export function addTask() {}` | `module.exports = { addTask }` |
| Use it | `import { addTask } from './todo.js'` | `const { addTask } = require('./todo')` |
| Default | `export default app` / `import app from './app.js'` | `module.exports = app` / `const app = require('./app')` |
| Built-in module | `import http from 'node:http'` | `const http = require('http')` |
| File ending | Required | Optional |
| Switched on by | `"type": "module"` or `.mjs` | The default, or `.cjs` |
| This file's directory | `import.meta.dirname` | `__dirname` |

To turn lecture code into course code: replace each `require()` with an `import`, each `module.exports` with `export`
in front of what is exported, and add the file endings.

If you mix them up you get one of these:

| Error | Cause |
|---|---|
| `ReferenceError: require is not defined in ES module scope` | `require()` in an ES module: use `import` |
| `SyntaxError: Cannot use import statement outside a module` | `import` in a file Node treats as CommonJS: check `"type": "module"` in `package.json` |
| `Error [ERR_MODULE_NOT_FOUND]` | The path is wrong or misses the file ending |
| `does not provide an export named ...` | The name is misspelled, or the module does not export it |

## Summary

- A module is a file that exports a few things and keeps the rest private.
- The course uses ES modules: `"type": "module"`, `export` in front of what you share, `import { name } from
  './file.js'` with the file ending.
- Prefer named exports in your own code; packages often have a default export.
- A module runs once and is shared by everything that imports it, which also goes for its variables.
- CommonJS (`require`) does the same job with other words; the table above translates.

## Read more

- MDN, JavaScript modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- Node.js, ECMAScript modules: https://nodejs.org/api/esm.html
- Node.js, determining the module system: https://nodejs.org/api/packages.html#determining-module-system
