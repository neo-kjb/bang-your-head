const express = require('express')
const router = express.Router({ mergeParams: true })

const Review = require('../models/review')
const Concert = require('../models/concerts')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const catchAsync = require('../utils/catchAsync')

router.post(
  '/',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const concert = await Concert.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    concert.reviews.push(review)
    await review.save()
    await concert.save()
    req.flash('success', 'Review posted')
    res.redirect(`/concerts/${concert._id}`)
  }),
)

router.delete(
  '/:revId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, revId } = req.params
    await Concert.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId)
    req.flash('success', 'Review deleted')
    res.redirect(`/concerts/${id}`)
  }),
)

module.exports = router
