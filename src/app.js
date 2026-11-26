import express from 'express'
import apiRouter from './route/api.js'

const app = express()

// Print each request, then let it go on to the routes
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World\n')
})

app.use('/api', apiRouter)
// app.use('/api', apiRouter) sends every request whose path starts with /api to the router, with /api taken off. /api/hello/Ada reaches the router as /hello/Ada.

export default app
