const mongoose = require('mongoose')
const Concert = require('../models/concerts')
const cities = require('./cities')
const { descriptors, names } = require('./seedHelpers')

main().catch((err) => console.log(err))

async function main() {
  mongoose.set('strictQuery', false)
  await mongoose.connect('mongodb://localhost:27017/head-bang', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
  await Concert.deleteMany({})
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const conc = new Concert({
      author: '63a18ae31dd77424310cb025',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      title: `${sample(descriptors)} ${sample(names)}`,
      images: [
        {
          url:
            'https://res.cloudinary.com/di9tp2zow/image/upload/v1671820620/BangYourHead/mvpddonanqv5ndnr7d5v.jpg',
          filename: 'BangYourHead/mvpddonanqv5ndnr7d5v',
        },
        {
          url:
            'https://res.cloudinary.com/di9tp2zow/image/upload/v1671820620/BangYourHead/mopjyab7hsiw1dwhpv9s.jpg',
          filename: 'BangYourHead/mopjyab7hsiw1dwhpv9s',
        },
      ],
      description:
        '  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos dolores vero cum atque amet nam obcaecati vel ratione dolorum qui totam maxime animi vitae praesentium ea, eos pariatur ullam et?',
      price: Math.floor(Math.random() * 20) + 10,
    })
    await conc.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
