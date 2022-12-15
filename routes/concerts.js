const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Concert = require('../models/concerts')
const { concertSchema, reviewSchema } = require('../schemas')

const validateConcert = (req, res, next) => {
  const { error } = concertSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.get(
  '/',
  catchAsync(async (req, res) => {
    const concerts = await Concert.find({})
    res.render('concerts/index', { concerts })
  }),
)

router.get('/new', (req, res) => {
  res.render('concerts/new')
})
router.post(
  '/',
  validateConcert,
  catchAsync(async (req, res) => {
    const concert = new Concert(req.body.concert)
    await concert.save()
    res.redirect(`/concerts/${concert._id}`)
  }),
)

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const concert = await Concert.findById(id).populate('reviews')
    res.render('concerts/show', { concert })
  }),
)

router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const concert = await Concert.findById(req.params.id)
    res.render('concerts/edit', { concert })
  }),
)
router.put(
  '/:id',
  validateConcert,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const concert = await Concert.findByIdAndUpdate(id, { ...req.body.concert })
    res.redirect(`/concerts/${concert._id}`)
  }),
)

router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Concert.findByIdAndDelete(id)
    res.redirect('/concerts')
  }),
)

module.exports = router
