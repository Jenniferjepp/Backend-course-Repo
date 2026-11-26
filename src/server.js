import app from './app.js'

const port = process.env.PORT ?? 3000 //?? = returnerar 3000 om det vänsta värdet är null

// In Express 5 the function given to app.listen() gets an error if the server could not start, for example when the port is busy. Without the if the program would say "Server listening" even then.
app.listen(port, (error) => {
  if (error) {
    throw error
  }
  console.log(`server listening on http://localhost:${port}`)
})
