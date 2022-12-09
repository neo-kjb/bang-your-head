const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Concert = require('./models/concerts')
const methodOverride = require('method-override')

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/head-bang', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('DB connected')
}

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/concerts', async (req, res) => {
  const concerts = await Concert.find({})
  res.render('concerts/index', { concerts })
})

app.get('/concerts/new', (req, res) => {
  res.render('concerts/new')
})
app.post('/concerts', async (req, res) => {
  const concert = new Concert(req.body.concert)
  await concert.save()
  res.redirect(`/concerts/${concert._id}`)
})

app.get('/concerts/:id', async (req, res) => {
  const { id } = req.params
  const concert = await Concert.findById(id)
  res.render('concerts/show', { concert })
})

app.get('/concerts/:id/edit', async (req, res) => {
  const concert = await Concert.findById(req.params.id)
  res.render('concerts/edit', { concert })
})
app.put('/concerts/:id', async (req, res) => {
  const { id } = req.params
  const concert = await Concert.findByIdAndUpdate(id, { ...req.body.concert })
  res.redirect(`/concerts/${concert._id}`)
})

app.listen(3000, () => {
  console.log('listening')
})
