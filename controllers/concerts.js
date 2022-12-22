const Concert = require('../models/concerts')

module.exports.index = async (req, res) => {
  const concerts = await Concert.find({})
  res.render('concerts/index', { concerts })
}

module.exports.renderNewForm = (req, res) => {
  res.render('concerts/new')
}

module.exports.createConcert = async (req, res) => {
  const concert = new Concert(req.body.concert)
  concert.author = req.user._id
  await concert.save()
  req.flash('success', 'Successfully made a new concert')
  res.redirect(`/concerts/${concert._id}`)
}
module.exports.showConcert = async (req, res) => {
  const { id } = req.params
  const concert = await Concert.findById(id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' },
    })
    .populate('author')
  if (!concert) {
    req.flash('error', 'Cannot find that concert')
    return res.redirect('/concerts')
  }
  res.render('concerts/show', { concert })
}
module.exports.renderEditForm = async (req, res) => {
  const concert = await Concert.findById(req.params.id)
  if (!concert) {
    req.flash('error', 'Cannot find that concert')
    return res.redirect('/concerts')
  }
  res.render('concerts/edit', { concert })
}
module.exports.updateConcert = async (req, res) => {
  const { id } = req.params
  const concert = await Concert.findByIdAndUpdate(id, { ...req.body.concert })
  req.flash('success', 'Concert updated')
  res.redirect(`/concerts/${concert._id}`)
}
module.exports.deleteConcert = async (req, res) => {
  const { id } = req.params
  await Concert.findByIdAndDelete(id)
  req.flash('success', 'Concert deleted')
  res.redirect('/concerts')
}