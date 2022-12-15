const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Concert = require('./models/concerts')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { concertSchema, reviewSchema } = require('./schemas')
const Review = require('./models/review')

const concerts = require('./routes/concerts')

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

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

app.use('/concerts', concerts)

app.post(
  '/concerts/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const concert = await Concert.findById(req.params.id)
    const review = new Review(req.body.review)
    concert.reviews.push(review)
    await review.save()
    await concert.save()

    res.redirect(`/concerts/${concert._id}`)
  }),
)

app.delete(
  '/concerts/:id/reviews/:revId',
  catchAsync(async (req, res) => {
    const { id, revId } = req.params
    await Concert.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId)
    res.redirect(`/concerts/${id}`)
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
