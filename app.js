const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Concert = require('./models/concerts')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/head-bang', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('DB connected')
}

const app = express()

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get(
  '/concerts',
  catchAsync(async (req, res) => {
    const concerts = await Concert.find({})
    res.render('concerts/index', { concerts })
  }),
)

app.get('/concerts/new', (req, res) => {
  res.render('concerts/new')
})
app.post(
  '/concerts',
  catchAsync(async (req, res) => {
    if (!req.body.concert) throw new ExpressError('Invalid Concert Data', 400)
    const concert = new Concert(req.body.concert)
    await concert.save()
    res.redirect(`/concerts/${concert._id}`)
  }),
)

app.get(
  '/concerts/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const concert = await Concert.findById(id)
    res.render('concerts/show', { concert })
  }),
)

app.get(
  '/concerts/:id/edit',
  catchAsync(async (req, res) => {
    const concert = await Concert.findById(req.params.id)
    res.render('concerts/edit', { concert })
  }),
)
app.put(
  '/concerts/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const concert = await Concert.findByIdAndUpdate(id, { ...req.body.concert })
    res.redirect(`/concerts/${concert._id}`)
  }),
)

app.delete(
  '/concerts/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Concert.findByIdAndDelete(id)
    res.redirect('/concerts')
  }),
)

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Somthing Went Wrong'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('listening')
})
