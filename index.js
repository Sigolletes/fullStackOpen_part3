const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

app.use(express.static('build'))

app.use(cors())

morgan.token("info", (req, res) => {
  const { body } = req
  return JSON.stringify(body)
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :info")
)

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

app.get('/', (req, res) => {
  res.send('<h1>PHONEBOOK BACKEND</h1><h2>Full Stack Open - part 3</h2><h5>by Sigolletes</h5>')
})

app.get('/info', (req, res) => {
  let time = Date()
  res.send(`<h1>INFORMATION</h1><p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  let num
  do {
    num = Math.floor(Math.random() * 10000)
  } while (persons.some(p => p.id === num))
  return num
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }
  if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'This name already exists in the phonebook' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
