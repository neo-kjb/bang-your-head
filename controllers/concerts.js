const Concert = require('../models/concerts')
const mbxgeocodeing = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAP_TOKEN
const geocoder = mbxgeocodeing({ accessToken: mapBoxToken })

const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
  const concerts = await Concert.find({})
  res.render('concerts/index', { concerts })
}

module.exports.renderNewForm = (req, res) => {
  res.render('concerts/new')
}

module.exports.createConcert = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.concert.location,
      limit: 1,
    })
    .send()
  const concert = new Concert(req.body.concert)
  concert.images = req.files.map((f) => ({ url: f.path, filename: f.filename }))
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
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }))
  concert.images.push(...imgs)
  await concert.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await concert.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }
  req.flash('success', 'Concert updated')
  res.redirect(`/concerts/${concert._id}`)
}
module.exports.deleteConcert = async (req, res) => {
  const { id } = req.params
  await Concert.findByIdAndDelete(id)
  req.flash('success', 'Concert deleted')
  res.redirect('/concerts')
}
