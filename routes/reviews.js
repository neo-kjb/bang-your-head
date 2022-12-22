const express = require('express')
const router = express.Router({ mergeParams: true })

const reviews = require('../controllers/reviews')

const Review = require('../models/review')
const Concert = require('../models/concerts')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const catchAsync = require('../utils/catchAsync')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete(
  '/:revId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview),
)

module.exports = router
