const { string } = require('joi')
const mongoose = require('mongoose')
const {Schema}=mongoose

const reviewShcema= new Schema({
    body:string,
    rating:Number
})

module.exports=mongoose.model('Review',reviewShcema)