import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import app from './app.js'

let server
let baseUrl

// Start the app on a free port before the tests, stop it after.
before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve)
  })
  baseUrl = `http://localhost:${server.address().port}`
})

after(() => server.close())

test('GET / says Hello World', async () => {
  const res = await fetch(`${baseUrl}/`)
  assert.equal(res.status, 200)
  assert.equal(await res.text(), 'Hello World\n')
})

test('an unknown path gives 404', async () => {
  const res = await fetch(`${baseUrl}/nope`)
  assert.equal(res.status, 404)
})

test('GET /api/hello answers with JSON', async () => {
  // 1. Send a request to /api/hello with fetch()
  const res = await fetch(`${baseUrl}/api/hello`)

  // 2. Check that the status is 200
  assert.equal(res.status, 200)

  // 3. Check that the content-type header contains application/json
  assert.match(res.headers.get('content-type'), /application\/json/)

  // 4. Check that the body is { message: 'Hello World' }
  assert.deepEqual(await res.json(), { message: 'Hello World' })
})

test('GET /api/hello/:name greets the name', async () => {
  const res = await fetch(`${baseUrl}/api/hello/Ada`)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { message: 'Hello Ada' })
})

test('?lang=sv greets in Swedish', async () => {
  // 1. Fetch /api/hello/Ada?lang=sv
  const res = await fetch(`${baseUrl}/api/hello/Ada?lang=sv`)

  // 2. Check that the status is 200
  assert.equal(res.status, 200)

  // 3. Check that the body is { message: 'Hej Ada' }
  assert.deepEqual(await res.json(), { message: 'Hej Ada' })
})

test('an unknown language gives 400', async () => {
  // 1. Fetch /api/hello/Ada?lang=xx
  const res = await fetch(`${baseUrl}/api/hello/Ada?lang=xx`)

  // 2. Check that the status is 400 and the Content-Type is JSON
  assert.equal(res.status, 400)
  assert.match(res.headers.get('content-type'), /application\/json/)

  // 3. Check that the body is { error: 'Unknown language: xx' }
  assert.deepEqual(await res.json(), { error: 'Unknown language: xx' })
})
