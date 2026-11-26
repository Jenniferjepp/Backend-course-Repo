import express from 'express'

const router = express.Router()

const greetings = {
  en: 'Hello',
  sv: 'Hej',
}

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' })
})

router.get('/hello/:name', (req, res) => {
  const lang = req.query.lang ?? 'en'

  if (!Object.hasOwn(greetings, lang)) {
    res.status(400).json({ error: `Unknown language: ${lang}` })
    return
  }

  res.json({ message: `${greetings[lang]} ${req.params.name}` })
})

export default router
