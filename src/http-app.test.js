import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from './http-app.js'

let server
let baseUrl

// Start the server on a free port before the tests, stop it after.
before(async () => {
  server = createApp()
  await new Promise((resolve) => server.listen(0, resolve))
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
