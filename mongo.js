const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Aname:${password}@cluster0.md7ambl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  let person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date()
  })

  person.save().then(result => {
    console.log(`Added ${process.argv[3]} Number: ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

/* let person = new Person({
  name: 'Aname',
  number: '555-5555',
  date: new Date()
})

person.save().then(result => {
  console.log('person saved!')
})

person = new Person({
  name: 'Surname',
  number: '555-6666',
  date: new Date()
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
}) */

