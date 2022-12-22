const express = require('express')
const router = express.Router()
const concerts = require('../controllers/concerts')
const catchAsync = require('../utils/catchAsync')
const Concert = require('../models/concerts')
const { isLoggedIn, isAuthor, validateConcert } = require('../middleware')

router
  .route('/')
  .get(catchAsync(concerts.index))
  .post(isLoggedIn, validateConcert, catchAsync(concerts.createConcert))

router.get('/new', isLoggedIn, concerts.renderNewForm)

router
  .route('/:id')
  .get(catchAsync(concerts.showConcert))
  .put(
    isLoggedIn,
    isAuthor,
    validateConcert,
    catchAsync(concerts.updateConcert),
  )
  .delete(isLoggedIn, isAuthor, catchAsync(concerts.deleteConcert))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(concerts.renderEditForm),
)

module.exports = router
