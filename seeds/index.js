const mongoose = require('mongoose')
const Concert = require('../models/concerts')
const cities = require('./cities')
const { descriptors, names } = require('./seedHelpers')

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/head-bang', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
  await Concert.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const conc = new Concert({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(names)}`,
    })
    await conc.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
