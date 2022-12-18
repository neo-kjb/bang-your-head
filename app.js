const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')

const concerts = require('./routes/concerts')
const reviews = require('./routes/reviews')

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
app.use(express.static(path.join(__dirname, 'public')))

app.use('/concerts', concerts)
app.use('/concerts/:id/reviews', reviews)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

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
