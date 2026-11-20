# 2-40 The library: your own JSON API, part 1

In 2-10 to 2-30 you built one app, step by step. In this exercise you start a project of your own: a JSON API for a
small library, with authors and the books they wrote. You write the code yourself. The exercise says what each route
must answer and gives you hints, and the tests tell you when you are done. There is no solution to copy; it is shown
in the Friday session of week 3.

This is what happens, step by step:

- You create the data, given as authors and books in memory, and a server that answers 404 as JSON.
- You write the functions that find books and authors, in a module of their own.
- You write the routes, in a router as in 2-20, one at a time, and try each with `curl`.
- You add the tests, which are given, and run them until they all pass.

The library grows through the course. This week the data is in memory, in a module. In 3-40 it moves to tables in
MariaDB with a terminal program next to it, and in 4-40 the routes get their data from the database, with the same
tests as now. Later you add create, update and delete, and a login.

You need 2-20 done. When you are done, your repo has a new directory next to `src/`:

```
library/
├── app.js          starts the server
└── src/
    ├── data.js     the authors and the books, in memory
    ├── book.js     the functions that find books and authors
    ├── api.js      the API routes, in a router
    └── api.test.js the tests of the API
```

The library is a project of its own, so it does not go in `src/`, which holds the app of the other exercises.

## Background: an API for two related things

Every book is written by an author. The book points out its author with the key `author_id`, the `id` of the author:

```text
authors                              books
id  name             born            id  title                    year  author_id
1   Astrid Lindgren  1907    <───    1   Pippi Longstocking       1945  1
                             <───    2   The Brothers Lionheart   1973  1
2   Tove Jansson     1914    <───    4   Finn Family Moomintroll  1948  2
```

That is how two tables in a database are related, with a *foreign key*, and you will see it again in 3-40. The API
gives the books and the authors as JSON, a book by its id, the author of a book, and the books of one author:

| Route | Answer |
|---|---|
| `GET /api/authors` | all authors, as an array |
| `GET /api/books` | all books, as an array |
| `GET /api/books?author_id=1` | the books of author 1, as an array |
| `GET /api/books/:id` | one book |
| `GET /api/books/:id/author` | the author of the book |

The keys are written as in a database table, in lower case with `_` (`author_id`), since that is where the data will
come from.

## 1. The data and the server

Create `library/src/data.js` with the data. It is given, so you can start with the code:

```js
// The data of the library, in memory for now. In 3-40 it moves to tables in MariaDB.

export const authors = [
  { id: 1, name: 'Astrid Lindgren', born: 1907 },
  { id: 2, name: 'Tove Jansson', born: 1914 },
  { id: 3, name: 'Selma Lagerlöf', born: 1858 },
]

export const books = [
  { id: 1, title: 'Pippi Longstocking', year: 1945, author_id: 1 },
  { id: 2, title: 'The Brothers Lionheart', year: 1973, author_id: 1 },
  { id: 3, title: "Ronia, the Robber's Daughter", year: 1981, author_id: 1 },
  { id: 4, title: 'Finn Family Moomintroll', year: 1948, author_id: 2 },
  { id: 5, title: 'The Summer Book', year: 1972, author_id: 2 },
  { id: 6, title: 'The Wonderful Adventures of Nils', year: 1906, author_id: 3 },
]
```

Create `library/app.js`, which starts the server. It is given too; you know its parts from 2-10 and 2-20:

```js
import express from 'express'
import api from './src/api.js'

const app = express()
const port = process.env.PORT ?? 3000

app.use('/api', api)

// Every other path: 404 with an error as JSON
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(port, (error) => {
  if (error) {
    throw error
  }
  console.log(`Library listening on http://localhost:${port}`)
})
```

The last `app.use()` has no path, so it gets every request that no route above it answered. An API answers with JSON
also when the path is wrong, instead of the HTML page Express sends by default.

Add a script to `package.json`, after `"check"`. The `"check"` line gets a comma at its end, since a line follows it
now; the last line has none:

```json
    "check": "npm run lint && npm run format:check && npm test",
    "library": "node library/app.js"
```

`npm run library` cannot start yet, since `src/api.js` is missing. That is next.

## 2. The functions: `book.js`

The routes should not search the arrays themselves. That is the job of a module, as `todo.js` was in 1-20, and in
4-40 you change only this module when the data moves to the database. Create `library/src/book.js`:

```js
import { authors, books } from './data.js'

export function getAuthors() {
  // 1. Return all authors
}

export function getBooks(filter = {}) {
  // 2. Return all books, or when filter.authorId is set, only the books with that author_id
}

export function getBook(id) {
  // 3. Return the book with that id, or undefined when there is none
}

export function getBookAuthor(id) {
  // 4. Return the author of the book with that id, or undefined when there is no such book
}
```

The functions return values and never print, and an id is a number here: `getBook(1)`, not `getBook('1')`. Turning
the string from the URL into a number is the job of the route.

Hints:

- Arrays have methods that do the searching for you. Look at `find()` and `filter()` in
  [Array on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
- `getBookAuthor()` can use `getBook()` first, and then look for the author whose `id` is the book's `author_id`.

Try the module from the root of your repo before you go on, with a line of Node:

```bash
node -e "import('./library/src/book.js').then((b) => console.log(b.getBook(1), b.getBookAuthor(4)))"
```

## 3. The routes: `api.js`

Create `library/src/api.js` with a router, as in 2-20, and export it with `export default router`. Write one route at
a time, start the server and try it with `curl`. Start with the authors:

```bash
export PORT=3000
npm run library
```

```bash
curl -i http://localhost:$PORT/api/authors
```

The routes must answer like this. The tests in step 4 check every line of the table.

| Request | Status | Body |
|---|---|---|
| `GET /api/authors` | 200 | `[{ "id": 1, "name": "Astrid Lindgren", "born": 1907 }, …]` |
| `GET /api/books` | 200 | `[{ "id": 1, "title": "Pippi Longstocking", "year": 1945, "author_id": 1 }, …]` |
| `GET /api/books/1` | 200 | `{ "id": 1, "title": "Pippi Longstocking", "year": 1945, "author_id": 1 }` |
| `GET /api/books/1/author` | 200 | `{ "id": 1, "name": "Astrid Lindgren", "born": 1907 }` |
| `GET /api/books?author_id=2` | 200 | the two books of Tove Jansson, as an array |
| `GET /api/books?author_id=9999` | 200 | `[]`: no books is an empty list, not an error |
| `GET /api/books/42` | 404 | `{ "error": "Book 42 not found" }` |
| `GET /api/books/42/author` | 404 | `{ "error": "Book 42 not found" }` |
| `GET /api/books/abc` | 400 | `{ "error": "The id must be a whole number" }` |
| `GET /api/books?author_id=many` | 400 | `{ "error": "author_id must be a whole number" }` |

The wording of the error messages is yours; the tests check that there is an `error` with a text.

Hints:

- The id comes as a string in `req.params.id`, and `author_id` as a string in `req.query.author_id`, or `undefined`
  when it is not in the URL. Turn them into numbers before you call the functions in `book.js`. A small helper does
  it, and answers `undefined` when the string is not a whole number, so `abc`, `1.5` and `-1` are all wrong:

  ```js
  /** A whole number from the URL, or undefined when it is not one. */
  function toId(value) {
    return /^\d+$/.test(value) ? Number(value) : undefined
  }
  ```

  `/^\d+$/` is a regular expression that means "only digits, from start to end".

- 400 and 404 are answered as in 2-20: `return res.status(...).json({ error: ... })`, with `return` so the route
  stops there.
- Check the input first (400), then look for the book (404), then answer (200).
- One route for `/books` handles both with and without `?author_id=`.

## 4. The tests

The tests are given. Create `library/src/api.test.js`:

```js
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import api from './api.js'

// The tests check what stays true when the data moves to the database (4-40): the keys, the status codes and how
// books and authors are related, not the exact titles.

let server
let baseUrl

// A small app with only the API router, on a free port (0).
before(async () => {
  const app = express()
  app.use('/api', api)
  await new Promise((resolve) => {
    server = app.listen(0, resolve)
  })
  baseUrl = `http://localhost:${server.address().port}/api`
})

after(() => server.close())

async function get(path) {
  const res = await fetch(`${baseUrl}${path}`)
  return { status: res.status, type: res.headers.get('content-type'), body: await res.json() }
}

test('GET /authors gives all authors, with author 1 and 2', async () => {
  const { status, type, body } = await get('/authors')
  assert.equal(status, 200)
  assert.match(type, /application\/json/)
  assert.ok(Array.isArray(body))
  for (const author of body) {
    assert.deepEqual(Object.keys(author).sort(), ['born', 'id', 'name'])
    assert.equal(typeof author.id, 'number')
  }
  assert.ok(body.some((author) => author.id === 1))
  assert.ok(body.some((author) => author.id === 2))
})

test('GET /books gives at least 5 books, as numbers where they should be', async () => {
  const { status, body } = await get('/books')
  assert.equal(status, 200)
  assert.ok(body.length >= 5)
  for (const book of body) {
    assert.deepEqual(Object.keys(book).sort(), ['author_id', 'id', 'title', 'year'])
    assert.equal(typeof book.id, 'number')
    assert.equal(typeof book.year, 'number')
    assert.equal(typeof book.author_id, 'number')
  }
})

test('GET /books/1 gives book 1', async () => {
  const { status, body } = await get('/books/1')
  assert.equal(status, 200)
  assert.equal(body.id, 1)
})

test('GET /books/1/author gives the author of book 1', async () => {
  const book = (await get('/books/1')).body
  const { status, body } = await get('/books/1/author')
  assert.equal(status, 200)
  assert.equal(body.id, book.author_id)
})

test('GET /books?author_id=1 gives the books of author 1, and only them', async () => {
  const all = (await get('/books')).body
  const { status, body } = await get('/books?author_id=1')
  assert.equal(status, 200)
  assert.ok(body.length > 0)
  assert.deepEqual(
    body,
    all.filter((book) => book.author_id === 1)
  )
})

test('an author without books gives an empty array', async () => {
  const { status, body } = await get('/books?author_id=9999')
  assert.equal(status, 200)
  assert.deepEqual(body, [])
})

test('a book that does not exist gives 404 with an error', async () => {
  for (const path of ['/books/9999', '/books/9999/author']) {
    const { status, body } = await get(path)
    assert.equal(status, 404, path)
    assert.equal(typeof body.error, 'string', path)
  }
})

test('an id or author_id that is not a whole number gives 400 with an error', async () => {
  for (const path of ['/books/abc', '/books/abc/author', '/books/1.5', '/books?author_id=many']) {
    const { status, body } = await get(path)
    assert.equal(status, 400, path)
    assert.equal(typeof body.error, 'string', path)
  }
})
```

Run them:

```bash
npm test -- library
```

The tests start their own small app with only your router, on a free port, so you do not need the server running.
Fix your code until all of them pass. Read the name of a failing test and the lines under it: they say what was
expected and what your API answered.

Look at what the tests check: keys, number types, status codes, and that the author of book 1 is the one its
`author_id` points to. They do not check the titles. That is on purpose: in 4-40 the data comes from the database,
and these tests should pass then too, without a change.

## Check and commit

Stop the server with `Ctrl+C`, then:

```bash
npm run check
git add library package.json
git commit -m "2-40 The library: a JSON API for books and authors"
```

If you have a remote of your own, push with `git push`.

### Verify

- [ ] `npm run library` starts the server, and every row in the table in step 3 answers as it should with `curl`.
- [ ] `npm test -- library` passes all the tests, and `npm run check` passes for the whole repo.
- [ ] The routes in `api.js` get their data only through the functions in `book.js`.
- [ ] You can say why the route turns the id into a number, and why `book.js` takes a number and not a string.
- [ ] You can say when the answer is 200, 400 or 404, and why no books for an author is `[]` and not 404.

<details>
<summary><code>Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../library/src/api.js'</code></summary>

`app.js` imports `./src/api.js`, so `npm run library` cannot start before that file exists. Create it, with at least
a router and `export default router`.

</details>

<details>
<summary>A test says <code>Expected values to be strictly equal: 404 !== 200</code> for <code>/books/1</code></summary>

The id from the URL is the string `'1'`, and `book.id === '1'` is false for the number `1`. Turn the id into a number
in the route, with `toId()`, before you call `getBook()`.

</details>

<details>
<summary><code>/api/books?author_id=1</code> gives all the books</summary>

The route does not read the query string, or `getBooks()` does not use the filter. Log `req.query` in the route and
check which key you get: it is `author_id` in the URL and `authorId` in the filter object you send to `getBooks()`.

</details>

<details>
<summary><code>npm test</code> or <code>curl</code> hangs and never ends</summary>

A route never answers: there is a way through it that reaches no `res.json()`, for example an `if` without the
answer in one of its branches. Run the request with `curl` to find which route it is, stop with `Ctrl+C`, and follow
the code of that route step by step.

</details>

## Challenge

Add `GET /api/authors/:id` and `GET /api/authors/:id/books`, with 400 and 404 as for the books. Write the tests
first, then the code. Then add `?year_from=` to `/api/books` for the books from that year and later, working together
with `?author_id=`.

## Read more

- `Array.prototype.find()` and `filter()`:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find and
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
- Routing in Express: https://expressjs.com/en/guide/routing.html
- HTTP status codes 400 and 404:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400 and
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404
- [Testing with Node.js](../doc/testing-with-node.md), the section "Testing a web server".
