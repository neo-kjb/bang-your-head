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

app.get('/concerts', async (req, res) => {
  const concerts = await Concert.find({})
  res.render('concerts/index', { concerts })
})

app.get('/concerts/:id', async (req, res) => {
  const { id } = req.params
  const conc = await Concert.findById(id)
  res.render('concerts/show', { conc })
})

app.listen(3000, () => {
  console.log('listening')
})
