const express = require('express')
const router = express.Router({ mergeParams: true })

const Review = require('../models/review')
const Concert = require('../models/concerts')

const { reviewSchema } = require('../schemas')

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.post(
  '/',
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

router.delete(
  '/:revId',
  catchAsync(async (req, res) => {
    const { id, revId } = req.params
    await Concert.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId)
    res.redirect(`/concerts/${id}`)
  }),
)

module.exports = router
