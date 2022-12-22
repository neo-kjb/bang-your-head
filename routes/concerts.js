const express = require('express')
const router = express.Router()
const concerts = require('../controllers/concerts')
const catchAsync = require('../utils/catchAsync')
const Concert = require('../models/concerts')
const { isLoggedIn, isAuthor, validateConcert } = require('../middleware')

router.get('/', catchAsync(concerts.index))

router.get('/new', isLoggedIn, concerts.renderNewForm)

router.post(
  '/',
  isLoggedIn,
  validateConcert,
  catchAsync(concerts.createConcert),
)

router.get('/:id', catchAsync(concerts.showConcert))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(concerts.renderEditForm),
)

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateConcert,
  catchAsync(concerts.updateConcert),
)

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(concerts.deleteConcert))

module.exports = router
