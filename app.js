const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Concert = require('./models/concerts')

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/head-bang', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('DB connected')
}

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/makeconcert', async (req, res) => {
  const conc = new Concert({
    title: 'killer jam',
    description: 'emotional live',
  })
  await conc.save()
  res.send(conc)
})

app.listen(3000, () => {
  console.log('listening')
})
