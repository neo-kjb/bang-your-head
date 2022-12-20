const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')

const catchAsync = require('../utils/catchAsync')

router.get('/register', async (req, res) => {
  res.render('users/register')
})

router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { email, password, username } = req.body
      const user = new User({ email, username })
      const registeredUser = await User.register(user, password)
      req.flash('success', 'Welcome to headbangers family!')
      res.redirect('/concerts')
    } catch (e) {
      req.flash('error', e.message)
      res.redirect('/register')
    }
  }),
)

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/concerts')
  },
)

module.exports = router
