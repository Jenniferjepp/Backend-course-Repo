import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { addTask, getTasks, clearTasks, deleteTask, getTasksAsJson } from './todo.js'

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


test('deleteTask removes by number, starting at 1', () => {
    // 1. Add two tasks
    addTask("Chilla");
    addTask("Grilla");

    // 2. Delete task number 1 and check that it returns the first task
    assert.equal(deleteTask(1), "Chilla");

    // 3. Check that only the second task is left in the list
    assert.deepEqual(getTasks(), ["Grilla"]);
})


test('deleteTask throws on a number outside the list', () => {
    // 1. Add one task
    addTask("Cook batatas bravas");

    // 2. Check that deleting task number 2 throws an error
    assert.throws(() => deleteTask(2), /valid task number/);
})


test('getTasksAsJson returns the list as JSON, numbered from 1', () => {
    // 1. Add one task
    addTask("Eat batatas bravas");

    // 2. Turn the JSON string back into data with JSON.parse()
    // 3. Check that it is an array with one object: { number: 1, task: ... }
    assert.deepEqual(JSON.parse(getTasksAsJson()), [{ number: 1, task: "Eat batatas bravas"}]);
  })